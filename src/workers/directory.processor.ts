/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Queue } from 'src/shared/types/queue';

@Processor(Queue.Directory)
export class DirectoryProcessor extends WorkerHost {
	public async process(job: Job, token?: string): Promise<any> {}
}
