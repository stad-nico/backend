/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Directory } from 'src/db/entities/directory.entity';

import { File } from 'src/db/entities/file.entity';
import { FileController } from 'src/features/cloud/files/files.controller';
import { FileService } from 'src/features/cloud/files/files.service';
import { StorageService } from 'src/shared/services/storage.service';

@Module({
	imports: [ConfigModule, MikroOrmModule.forFeature([File, Directory])],
	controllers: [FileController],
	providers: [FileService, StorageService],
	exports: [FileService],
})
export class FilesModule {}
