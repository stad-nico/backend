/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Queue as QueueEnum } from 'src/shared/types/queue';

export enum DirectoryJob {
	UpdatedAt = 'directory.updatedAt',
}

type DirectoryJobData = {
	[DirectoryJob.UpdatedAt]: { id: string; updatedAt: Date };
};

export class DirectoryQueue {
	constructor(@InjectQueue(QueueEnum.Directory) private readonly queue: Queue<DirectoryJobData[DirectoryJob]>) {}

	public async addJob<Job extends DirectoryJob>(job: Job, data: DirectoryJobData[Job]) {
		return this.queue.add(job, data);
	}
}
