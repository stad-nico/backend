/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { mkdir, rm, statfs } from 'fs/promises';
import * as path from 'path';

import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environment, NodeEnv } from 'src/config/env.config';
import { pathExists } from 'src/util/path-exists';

export enum StoragePath {
	Data = 'data',
}

@Injectable()
export class DiskService implements BeforeApplicationShutdown {
	private readonly logger = new Logger(DiskService.name);

	/**
	 * The complete, absolute path to the storage location loaded from env
	 */
	private readonly storageLocationPath: string;

	/**
	 * The configService
	 */
	private readonly configService: ConfigService;

	public constructor(configService: ConfigService) {
		this.configService = configService;
		this.storageLocationPath = configService.getOrThrow(Environment.StoragePath);
	}

	public async beforeApplicationShutdown(): Promise<void> {
		if (this.configService.getOrThrow(Environment.NodeENV) === NodeEnv.Production) {
			return;
		}

		this.logger.log('Cleaning up...');

		await rm(this.storageLocationPath, { recursive: true });

		this.logger.log('Finished cleaning up');
	}

	public async init(): Promise<void> {
		await this.initStorageLocation();
	}

	private async initStorageLocation(): Promise<void> {
		const storagePath = path.join(this.storageLocationPath, StoragePath.Data);

		if (!(await pathExists(storagePath))) {
			this.logger.log(`Trying to initialize storage location '${this.storageLocationPath}' ...`);

			await mkdir(storagePath, { recursive: true });

			this.logger.log('Successfully initialized storage location');
		}

		const stats = await statfs(this.storageLocationPath);
		const freeSpace = Number(stats.bsize * stats.bfree);

		this.logger.log(`Storage location ${this.storageLocationPath} has ${this.formatBytes(freeSpace)} of free space`);
	}

	// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
	private formatBytes(bytes: number, decimals = 2): string {
		if (!+bytes) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
}
