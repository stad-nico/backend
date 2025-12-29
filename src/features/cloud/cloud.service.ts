import { Injectable } from '@nestjs/common';
import { FileRepository } from 'src/db/entities/file.entity';
import { DirectoryRepository } from 'src/db/repositories/directory.repository';
import { GetStatsResponse } from './mapping/stats/get-stats.response';

const LAST_UPLOADED_FILES_LIMIT = 5;

@Injectable()
export class CloudService {
	constructor(
		private readonly fileRepository: FileRepository,
		private readonly directoryRepository: DirectoryRepository
	) {}

	/**
	 * Get statistics about the cloud for a user.
	 *
	 * @param userId the id of the user
	 * @returns the statistics
	 */
	public async getStats(userId: string): Promise<GetStatsResponse> {
		const files = await this.fileRepository.getTotalByUserId(userId);
		const directories = await this.directoryRepository.getTotalByUserId(userId);
		const lastUploadedFiles = await this.fileRepository.getLastUploadedByUserId(userId, LAST_UPLOADED_FILES_LIMIT);

		return GetStatsResponse.from(files, directories, lastUploadedFiles);
	}
}
