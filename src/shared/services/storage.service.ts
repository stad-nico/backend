import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, ReadStream } from 'fs';
import { rm } from 'fs/promises';
import { StoragePath } from 'src/modules/disk/disk.service';
import { FileUtils } from 'src/util/FileUtils';
import { PathUtils } from 'src/util/PathUtils';

@Injectable()
export class StorageService {
	public constructor(private readonly configService: ConfigService) {}

	public async save(id: string, data: Buffer): Promise<void> {
		const resolvedPath = PathUtils.join(this.configService, StoragePath.Data, PathUtils.uuidToDirPath(id));
		await FileUtils.writeFile(resolvedPath, data);
	}

	public async streamOrThrow(id: string): Promise<ReadStream> {
		const diskPath = PathUtils.join(this.configService, StoragePath.Data, PathUtils.uuidToDirPath(id));

		if (!(await PathUtils.pathExists(diskPath))) {
			throw new Error(`Entity with id ${id} exists in database but its data does not exist on disk`);
		}

		return createReadStream(diskPath);
	}

	public async delete(id: string): Promise<void> {
		const diskPath = PathUtils.join(this.configService, StoragePath.Data, PathUtils.uuidToDirPath(id));
		await rm(diskPath);
	}
}
