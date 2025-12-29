import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Directory } from 'src/db/entities/directory.entity';
import { File } from 'src/db/entities/file.entity';
import { DirectoriesModule } from 'src/features/cloud/directories/directories.module';
import { FilesModule } from 'src/features/cloud/files/files.module';
import { CloudController } from './cloud.controller';
import { CloudService } from './cloud.service';

@Module({
	controllers: [CloudController],
	providers: [CloudService],
	imports: [FilesModule, DirectoriesModule, MikroOrmModule.forFeature([File, Directory])]
})
export class CloudModule {}
