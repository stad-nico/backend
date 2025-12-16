/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, StreamableFile } from '@nestjs/common';
import { User } from 'src/db/entities/user.entitiy';
import * as DirectoryOpenApi from 'src/features/cloud/directories/directories.openapi';
import { DirectoryService } from 'src/features/cloud/directories/directories.service';
import { GetDirectoryContentsParams } from 'src/features/cloud/directories/mapping/contents/get-directory-contents.params';
import { GetDirectoryContentsResponse } from 'src/features/cloud/directories/mapping/contents/get-directory-contents.response';
import { CreateDirectoryBody } from 'src/features/cloud/directories/mapping/create/create-directory.body';
import { CreateDirectoryParams } from 'src/features/cloud/directories/mapping/create/create-directory.params';
import { CreateDirectoryResponse } from 'src/features/cloud/directories/mapping/create/create-directory.response';
import { DeleteDirectoryParams } from 'src/features/cloud/directories/mapping/delete/delete-directory.params';
import { DownloadDirectoryParams } from 'src/features/cloud/directories/mapping/download/download-directory.params';
import { GetDirectoryMetadataParams } from 'src/features/cloud/directories/mapping/metadata/get-directory-metadata.params';
import { GetDirectoryMetadataResponse } from 'src/features/cloud/directories/mapping/metadata/get-directory-metadata.response';
import { RenameDirectoryBody } from 'src/features/cloud/directories/mapping/rename/rename-directory.body';
import { RenameDirectoryParams } from 'src/features/cloud/directories/mapping/rename/rename-directory.params';
import { GetDirectoryRootResponse } from 'src/features/cloud/directories/mapping/root/get-directory-root.response';
import { User as UserDecorator } from 'src/shared/decorators/user.decorator';

@Controller('cloud/directories')
@DirectoryOpenApi.Controller
export class DirectoryController {
	constructor(private readonly directoryService: DirectoryService) {}

	@Post(':id')
	@HttpCode(HttpStatus.CREATED)
	@DirectoryOpenApi.CreateDirectory
	public async createDirectory(
		@Param() params: CreateDirectoryParams,
		@Body() body: CreateDirectoryBody,
		@UserDecorator() user: User
	): Promise<CreateDirectoryResponse> {
		const directoryId = await this.directoryService.createDirectoryOrThrow(body.name, params.id, user.id);

		return CreateDirectoryResponse.fromId(directoryId);
	}

	@Get('root')
	@HttpCode(HttpStatus.OK)
	@DirectoryOpenApi.GetDirectoryRoot
	public async getDirectoryRoot(@UserDecorator() user: User): Promise<GetDirectoryRootResponse> {
		const rootDirectoryId = await this.directoryService.getOrCreateRoot(user.id);

		return GetDirectoryRootResponse.fromId(rootDirectoryId);
	}

	@Get(':id/contents')
	@HttpCode(HttpStatus.OK)
	@DirectoryOpenApi.GetDirectoryContents
	public async getDirectoryContents(@Param() params: GetDirectoryContentsParams): Promise<GetDirectoryContentsResponse> {
		return await this.directoryService.getDirectoryContentsOrThrow(params.id);
	}

	@Get(':id/metadata')
	@HttpCode(HttpStatus.OK)
	@DirectoryOpenApi.GetDirectoryMetadata
	public async getDirectoryMetadata(@Param() params: GetDirectoryMetadataParams): Promise<GetDirectoryMetadataResponse> {
		const metadata = await this.directoryService.getDirectoryMetadataOrThrow(params.id);

		return GetDirectoryMetadataResponse.fromMetadata(metadata);
	}

	@Get(':id/download')
	@HttpCode(HttpStatus.OK)
	@DirectoryOpenApi.DownloadDirectory
	public async downloadDirectory(@Param() params: DownloadDirectoryParams): Promise<StreamableFile> {
		const { stream, filename } = await this.directoryService.createZipStreamOrThrow(params.id);

		return new StreamableFile(stream, { type: 'application/zip', disposition: `attachment; filename=${filename}` });
	}

	@Patch(':id/rename')
	@HttpCode(HttpStatus.NO_CONTENT)
	@DirectoryOpenApi.RenameDirectory
	public async renameDirectory(@Param() params: RenameDirectoryParams, @Body() body: RenameDirectoryBody): Promise<void> {
		await this.directoryService.renameDirectoryOrThrow(params.id, body.name);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@DirectoryOpenApi.DeleteDirectory
	public async deleteDirectory(@Param() params: DeleteDirectoryParams): Promise<void> {
		await this.directoryService.deleteDirectoryOrThrow(params.id);
	}
}
