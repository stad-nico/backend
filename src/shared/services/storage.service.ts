import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, ReadStream } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import * as path from 'path';
import { Environment } from 'src/config/env.config';
import { uuidToDirPath } from 'src/util/uuid-to-dir-path';

@Injectable()
export class StorageService {
	/**
	 * The base path where files are stored. Loaded from env.
	 */
	private readonly BASE_PATH = this.configService.getOrThrow<string>(Environment.STORAGE_PATH);

	public constructor(private readonly configService: ConfigService) {}

	/**
	 * Saves a file with the given id and data.
	 * Uses the id to determine the path where to save the file.
	 *
	 * @param id the id of the file (uuid v4)
	 * @param data the data to save
	 */
	public async save(id: string, data: Buffer): Promise<void> {
		const filePath = `${this.BASE_PATH}/${uuidToDirPath(id)}`;
		const dirname = path.dirname(filePath);

		await mkdir(dirname, { recursive: true });
		await writeFile(filePath, data);
	}

	/**
	 * Streams the contents of the file with the given id.
	 *
	 * @param id the id of the file (uuid v4)
	 * @returns a readable stream of the file contents
	 */
	public async streamOrThrow(id: string): Promise<ReadStream> {
		const diskPath = `${this.BASE_PATH}/${uuidToDirPath(id)}`;

		return createReadStream(diskPath);
	}

	/**
	 * Deletes the file with the given id.
	 *
	 * @param id the id of the file (uuid v4)
	 */
	public async delete(id: string): Promise<void> {
		await rm(`${this.BASE_PATH}/${uuidToDirPath(id)}`);
	}
}
