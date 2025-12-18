import { Module } from '@nestjs/common';
import { DirectoriesModule } from 'src/features/cloud/directories/directories.module';
import { FilesModule } from 'src/features/cloud/files/files.module';

@Module({
	imports: [FilesModule, DirectoriesModule]
})
export class CloudModule {}
