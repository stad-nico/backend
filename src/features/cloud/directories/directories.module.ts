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
import { Tree } from 'src/db/entities/tree.entity';
import { DirectoryController } from 'src/features/cloud/directories/directories.controller';
import { DirectoryService } from 'src/features/cloud/directories/directories.service';

@Module({
	imports: [ConfigModule, MikroOrmModule.forFeature([Directory, File, Tree])],
	controllers: [DirectoryController],
	providers: [DirectoryService],
	exports: [DirectoryService]
})
export class DirectoriesModule {}
