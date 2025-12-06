/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Transactional } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ROOT_ID } from 'src/db/entities/directory.entity';
import { FileRepository } from 'src/db/entities/file.entity';
import { DirectoryMetadata, DirectoryRepository } from 'src/db/repositories/directory.repository';
import { DirectoryAlreadyExistsException } from 'src/features/cloud/directories/exceptions/directory-already-exists.exception';
import { DirectoryNotFoundException } from 'src/features/cloud/directories/exceptions/directory-not-found.exception';
import { DirectoryContents } from 'src/features/cloud/directories/mapping/contents/get-directory-contents.response';
import { createZIPArchiveOrThrow } from 'src/features/cloud/directories/utils/create-zip-archive';
import { Readable } from 'stream';

@Injectable()
export class DirectoryService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly directoryRepository: DirectoryRepository,
		private readonly fileRepository: FileRepository
	) {}

	/**
	 * Returns the root directory for the given user or creates it if it does not exist.
	 *
	 * @param userId the id of the user
	 * @returns the id of the root directory
	 */
	@Transactional()
	public async getOrCreateRoot(userId: string): Promise<string> {
		let rootDirectory = await this.directoryRepository.findOne({ parent: null, user: userId });

		if (!rootDirectory) {
			rootDirectory = this.directoryRepository.create({ parent: null, name: ROOT_ID, user: userId });
		}

		return rootDirectory.id;
	}

	/**
	 * Creates a new directory with the given name and parent id for the user.
	 * Also updates the `updatedAt` field of the parent directory.
	 *
	 * @throws DirectoryNotFoundException if the parent directory does not exist
	 * @throws DirectoryAlreadyExistsException if a directory with the same name already exists in the parent directory
	 *
	 * @param name the name of the directory
	 * @param parentId the id of the parent directory
	 * @param userId the id of the user
	 * @returns the id of the created directory
	 */
	@Transactional()
	public async createDirectoryOrThrow(name: string, parentId: string, userId: string): Promise<string> {
		const maybeParentDirectory = await this.directoryRepository.findOne({ id: parentId });

		if (!maybeParentDirectory) {
			throw DirectoryNotFoundException.fromId(parentId);
		}

		const maybeExistingDirectory = await this.directoryRepository.findOne({ parent: parentId, name, user: userId });

		if (maybeExistingDirectory) {
			throw DirectoryAlreadyExistsException.fromName(name);
		}

		const directory = this.directoryRepository.create({ parent: parentId, name, user: userId });

		//! MOVE TO DB TRIGGER INSTEAD
		await this.directoryRepository.nativeUpdate({ id: parentId }, { updatedAt: new Date() });

		return directory.id;
	}

	/**
	 * Retrieves the contents of a directory by its id.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 *
	 * @param id the id of the directory
	 * @returns the contents of the directory
	 */
	@Transactional()
	public async getDirectoryContentsOrThrow(id: string): Promise<DirectoryContents> {
		const maybeDirectory = await this.directoryRepository.findOne({ id });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(id);
		}

		const files = await this.fileRepository.findAll({ where: { parent: id } });
		const directories = await this.directoryRepository.getContents(maybeDirectory);

		return { files, directories };
	}

	/**
	 * Retrieves the metadata of a directory by its id.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 *
	 * @param id the id of the directory
	 * @returns the metadata of the directory
	 */
	@Transactional()
	public async getDirectoryMetadataOrThrow(id: string): Promise<DirectoryMetadata> {
		const maybeDirectory = await this.directoryRepository.findOne({ id });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(id);
		}

		return await this.directoryRepository.getMetadata(maybeDirectory);
	}

	/**
	 * Creates a zip stream of the directory with the given id.
	 * The stream contains all files in the directory and its subdirectories.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 *
	 * @param id the id of the directory
	 * @returns a stream of the zip archive and the filename of the archive
	 */
	@Transactional()
	public async createZipStreamOrThrow(id: string): Promise<{ stream: Readable; filename: string }> {
		const maybeDirectory = await this.directoryRepository.findOne({ id });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(id);
		}

		const { files, directories } = await this.directoryRepository.getContentsRecursive(maybeDirectory.id);

		const stream = await createZIPArchiveOrThrow(this.configService, id, files, directories);

		return { stream, filename: maybeDirectory.name + '.zip' };
	}

	/**
	 * Renames a directory.
	 * Also updates the `updatedAt` field of the parent directory.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 * @throws DirectoryAlreadyExistsException if a directory with the same name already exists in the parent directory
	 *
	 * @param id the id of the directory to rename
	 * @param name the new name of the directory
	 */
	@Transactional()
	public async renameDirectoryOrThrow(id: string, name: string): Promise<void> {
		const maybeDirectory = await this.directoryRepository.findOne({ id });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(id);
		}

		const maybeExistingDirectory = await this.directoryRepository.findOne({ parent: maybeDirectory.parent, name });

		if (maybeExistingDirectory) {
			throw DirectoryAlreadyExistsException.fromName(name);
		}

		await this.directoryRepository.nativeUpdate({ id }, { name });

		if (maybeDirectory.parent?.id) {
			//! MOVE TO DB TRIGGER
			await this.directoryRepository.nativeUpdate({ id: maybeDirectory.parent.id }, { updatedAt: new Date() });
		}
	}

	/**
	 * Deletes a directory by its id.
	 * Also updates the `updatedAt` field of the parent directory
	 * and to delete all files in the directory and its subdirectories.
	 *
	 * @throws DirectoryNotFoundException if the directory does not exist
	 *
	 * @param id the id of the directory to delete
	 */
	@Transactional()
	public async deleteDirectoryOrThrow(id: string): Promise<void> {
		const maybeDirectory = await this.directoryRepository.findOne({ id });

		if (!maybeDirectory) {
			throw DirectoryNotFoundException.fromId(id);
		}

		await this.directoryRepository.nativeDelete({ id });

		if (maybeDirectory.parent?.id) {
			//! MOVE TO DB TRIGGER INSTEAD
			await this.directoryRepository.nativeUpdate({ id: maybeDirectory.parent.id }, { updatedAt: new Date() });
		}
	}
}
