/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ConfigService } from '@nestjs/config';
import archiver from 'archiver';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { StoragePath } from 'src/modules/disk/disk.service';
import { PathUtils } from 'src/util/PathUtils';
import { PassThrough, Readable } from 'stream';

/**
 * Utility class for operations on the file system.
 * @class
 */
export class FileUtils {
	/**
	 * Tries to delete the directory recursively.
	 * Throws an error if it fails.
	 *
	 * @param path the absolute path
	 * @param recursive whether subfolders should get deleted
	 */
	public static async deleteDirectoryOrFail(path: string, recursive = true): Promise<void> {
		await fsPromises.rm(path, { recursive: recursive });
	}

	/**
	 * Tries to create the directory recursively if it does not already exist.
	 * Throws an error if it fails.
	 *
	 * @param path the absolute path
	 * @param recursive whether subfolders should be created
	 */
	public static async createDirectoryIfNotPresent(path: string, recursive = true): Promise<void> {
		if (await PathUtils.pathExists(path)) {
			return;
		}

		await fsPromises.mkdir(path, { recursive: recursive });
	}

	/**
	 * Writes a file stream to the disk.
	 *
	 * @param absolutePath the destination path
	 * @param stream the file stream
	 * @param recursive whether destination path should be created if it does not exist
	 */
	public static async writeFile(absolutePath: string, buffer: Buffer, recursive = true): Promise<void> {
		const normalizedPath = PathUtils.prepareFilePathForFS(absolutePath);

		if (recursive) {
			const parentPath = PathUtils.prepareFilePathForFS(path.dirname(normalizedPath));

			if (!(await PathUtils.pathExists(parentPath))) {
				await fsPromises.mkdir(parentPath, { recursive: true });
			}
		}

		await fsPromises.writeFile(normalizedPath, buffer);
	}

	/**
	 * Creates a stream of the zip archive with the given files..
	 *
	 * @param configService the config service
	 * @param files the files
	 * @returns the stream
	 */
	public static async createZIPArchiveOrThrow(
		configService: ConfigService,
		files: Array<{ id: string; relativePath: string }>
	): Promise<Readable> {
		const archive = archiver('zip', { zlib: { level: 9 } });
		const stream = new PassThrough();

		archive.on('error', (err: unknown) => {
			throw err;
		});

		archive.pipe(stream);

		for (const file of files) {
			const filepath = PathUtils.join(configService, StoragePath.Data, PathUtils.uuidToDirPath(file.id));

			if (!(await PathUtils.pathExists(filepath))) {
				console.error(`File with id <${file.id}> exists in database but does not exist on disk`);
			}

			archive.file(filepath, { name: file.relativePath });
		}

		archive.finalize();
		return stream;
	}
}
