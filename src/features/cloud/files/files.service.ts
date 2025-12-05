/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Transactional } from '@mikro-orm/mariadb';
import { Injectable, StreamableFile } from '@nestjs/common';
import { FileRepository } from 'src/db/entities/file.entity';
import { DirectoryRepository } from 'src/db/repositories/directory.repository';
import { DirectoryNotFoundException } from 'src/features/cloud/directories/exceptions/directory-not-found.exception';
import { FileAlreadyExistsException } from 'src/features/cloud/files/exceptions/file-already-exists.exception';
import { FileNotFoundException } from 'src/features/cloud/files/exceptions/file-not-found.exception';
import { FileMetadata } from 'src/features/cloud/files/types/file-metadata';
import { StorageService } from 'src/shared/services/storage.service';

@Injectable()
export class FileService {
	public constructor(
		private readonly fileRepository: FileRepository,
		private readonly directoryRepository: DirectoryRepository,
		private readonly storageService: StorageService
	) {}

	/**
	 * Uploads a file to the specified directory.
	 * Also updates the parent directory's `updatedAt` field.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 * @throws FileAlreadyExistsException if a file with the same name already exists in the directory
	 *
	 * @param directoryId the id of the directory where the file should be uploaded
	 * @param multerFile the file to upload
	 * @param userId the id of the user who uploads the file
	 * @returns the id of the uploaded file
	 */
	@Transactional()
	public async uploadFileOrThrow(directoryId: string, multerFile: Express.Multer.File, userId: string): Promise<string> {
		const maybeDirectory = await this.directoryRepository.findOne({ id: directoryId });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(directoryId);
		}

		const maybeExistingFile = await this.fileRepository.findOne({ name: multerFile.originalname, parent: directoryId });

		if (maybeExistingFile) {
			throw FileAlreadyExistsException.fromName(multerFile.originalname);
		}

		const file = this.fileRepository.create({
			name: multerFile.originalname,
			size: multerFile.size,
			mimeType: multerFile.mimetype,
			parent: maybeDirectory,
			user: userId,
		});

		await this.storageService.save(file.id, multerFile.buffer);

		if (maybeDirectory.parent?.id) {
			//! MOVE TO DB TRIGGER INSTEAD
			await this.directoryRepository.nativeUpdate({ id: maybeDirectory.id }, { updatedAt: new Date() });
		}

		return file.id;
	}

	/**
	 * Retrieves the metadata of a file by its id.
	 *
	 * @throws FileNotFoundException if the file does not exist
	 *
	 * @param id the id of the file
	 * @returns the metadata of the file
	 */
	@Transactional()
	public async getFileMetadataOrThrow(id: string): Promise<FileMetadata> {
		const maybeFile = await this.fileRepository.findOne({ id });

		if (!maybeFile) {
			throw FileNotFoundException.fromId(id);
		}

		const { path, idChain } = await this.directoryRepository.getPath(maybeFile.parent.id);

		return { ...maybeFile, userId: maybeFile.user.id, parentId: maybeFile.parent.id, path: `${path}/${maybeFile.name}`, idChain };
	}

	/**
	 * Retrieves a readable stream of the file.
	 *
	 * @throws FileNotFoundException if the file does not exist
	 * @throws Error if the file exists in the database but not on disk
	 *
	 * @param id the id of the file
	 * @returns an object containing the readable stream, mime type, and file name
	 */
	@Transactional()
	public async streamFileOrThrow(id: string): Promise<StreamableFile> {
		const maybeFile = await this.fileRepository.findOne({ id });

		if (!maybeFile) {
			throw FileNotFoundException.fromId(id);
		}

		const stream = await this.storageService.streamOrThrow(id);

		const { mimeType, name } = maybeFile;

		return new StreamableFile(stream, { type: mimeType, disposition: `attachment; filename=${name}` });
	}

	/**
	 * Renames a file. Also updates the parent directory's `updatedAt` field.
	 *
	 * @throws FileNotFoundException if the file does not exist
	 * @throws FileAlreadyExistsException if a file with the same name already exists in the parent directory
	 *
	 * @param id the id of the file to rename
	 * @param name the new name for the file
	 */
	@Transactional()
	public async renameFileOrThrow(id: string, name: string): Promise<void> {
		const maybeFile = await this.fileRepository.findOne({ id });

		if (!maybeFile) {
			throw FileNotFoundException.fromId(id);
		}

		const maybeExistingFile = await this.fileRepository.findOne({ parent: maybeFile.parent, name });

		if (maybeExistingFile) {
			throw FileAlreadyExistsException.fromName(name);
		}

		await this.fileRepository.nativeUpdate({ id }, { name });

		//! MOVE TO DB TRIGGER INSTEAD
		await this.directoryRepository.nativeUpdate({ id: maybeFile.parent.id }, { updatedAt: new Date() });
	}

	/**
	 * Deletes a file from the database.
	 * Also schedules a job to delete the file from disk and update all parent directories `updatedAt` fields.
	 *
	 * @throws FileNotFoundException if the file does not exist
	 *
	 * @param id the file id
	 */
	@Transactional()
	public async deleteFileOrThrow(id: string): Promise<void> {
		const maybeFile = await this.fileRepository.findOne({ id });

		if (!maybeFile) {
			throw FileNotFoundException.fromId(id);
		}

		await this.fileRepository.nativeDelete({ id });

		//! MOVE TO DB TRIGGER INSTEAD
		await this.directoryRepository.nativeUpdate({ id: maybeFile.parent.id }, { updatedAt: new Date() });

		//! DELETE FILE HERE
		await this.storageService.delete(id);
	}
}
