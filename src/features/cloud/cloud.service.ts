import { Injectable } from '@nestjs/common';
import { FileRepository } from 'src/db/entities/file.entity';
import { DirectoryRepository } from 'src/db/repositories/directory.repository';
import { GetStatsResponse } from './mapping/stats/get-stats.response';

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

		return GetStatsResponse.from(files, directories);
	}
}
