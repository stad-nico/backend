import { ConfigService } from '@nestjs/config';
import archiver from 'archiver';
import { Environment } from 'src/config/env.config';
import { Directory } from 'src/db/entities/directory.entity';
import { File } from 'src/db/entities/file.entity';
import { uuidToDirPath } from 'src/util/uuid-to-dir-path';
import { PassThrough, Readable } from 'stream';

/**
 * Creates a stream of the zip archive with the given files
 *
 * @param configService the config service
 * @param files the files
 * @returns the stream
 */
export async function createZIPArchiveOrThrow(
	configService: ConfigService,
	rootId: string,
	files: Array<File>,
	directories: Array<Directory>
): Promise<Readable> {
	const filePaths = buildFilePaths(rootId, files, directories);

	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = new PassThrough();

	archive.on('error', (err: unknown) => {
		throw err;
	});

	archive.pipe(stream);

	for (const file of filePaths) {
		const filepath = `${configService.get(Environment.STORAGE_PATH)}/${uuidToDirPath(file.id)}`;

		try {
			archive.file(filepath, { name: file.relativePath });
		} catch (error) {
			console.error(`Failed to add file with id <${file.id}> to zip archive:`, error);
		}
	}

	archive.finalize();
	return stream;
}

/**
 * Recursively builds the file paths relative to the root
 *
 * @param rootId the id of the directory root
 * @param files the files the directory contains
 * @param directories the subdirectories the root contains
 * @returns the relative paths
 */
function buildFilePaths(rootId: string, files: Array<File>, directories: Array<Directory>): Array<{ id: string; relativePath: string }> {
	const filesToPush = files.filter((file) => file.parent.id === rootId).map((file) => ({ id: file.id, relativePath: file.name }));

	const directoriesToPush = directories
		.filter((directory) => directory.parent?.id === rootId)
		.flatMap((directory) => [
			{ id: directory.id, relativePath: directory.name },
			...buildFilePaths(directory.id, files, directories).map((entry) => ({
				id: entry.id,
				relativePath: `${directory.name}/${entry.relativePath}`,
			})),
		]);

	return [...filesToPush, ...directoriesToPush];
}
