/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	StreamableFile,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/db/entities/user.entitiy';
import { FileOpenApi } from 'src/features/cloud/files/file.openapi';
import { FileService } from 'src/features/cloud/files/files.service';
import { DeleteFileParams } from 'src/features/cloud/files/mapping/delete/delete-file.params';
import { DownlaodFileParams } from 'src/features/cloud/files/mapping/download/download-file.params';
import { GetFileMetadataParams } from 'src/features/cloud/files/mapping/metadata/get-file-metadata.params';
import { GetFileMetadataResponse } from 'src/features/cloud/files/mapping/metadata/get-file-metadata.response';
import { RenameFileBody } from 'src/features/cloud/files/mapping/rename/rename-file.body';
import { RenameFileParams } from 'src/features/cloud/files/mapping/rename/rename-file.params';
import { UploadFileBody } from 'src/features/cloud/files/mapping/upload/upload-file.body';
import { UploadFileResponse } from 'src/features/cloud/files/mapping/upload/upload-file.response';
import { User as UserDecorator } from 'src/shared/decorators/user.decorator';

@Controller('cloud/files')
@FileOpenApi.Controller
export class FileController {
	public constructor(private readonly fileService: FileService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	@FileOpenApi.UploadFile
	public async uploadFile(
		@Body() body: UploadFileBody,
		@UploadedFile() file: Express.Multer.File,
		@UserDecorator() user: User
	): Promise<UploadFileResponse> {
		const id = await this.fileService.uploadFileOrThrow(body.directoryId, file, user.id);

		return UploadFileResponse.fromId(id);
	}

	@Get(':id/metadata')
	@HttpCode(HttpStatus.OK)
	@FileOpenApi.GetFileMetadata
	public async getFileMetadata(@Param() params: GetFileMetadataParams): Promise<GetFileMetadataResponse> {
		const metadata = await this.fileService.getFileMetadataOrThrow(params.id);

		return GetFileMetadataResponse.fromMetadata(metadata);
	}

	@Get(':id/download')
	@HttpCode(HttpStatus.OK)
	@FileOpenApi.DownloadFile
	public async downloadFile(@Param() params: DownlaodFileParams): Promise<StreamableFile> {
		return await this.fileService.streamFileOrThrow(params.id);
	}

	@Patch(':id/rename')
	@HttpCode(HttpStatus.NO_CONTENT)
	@FileOpenApi.RenameFile
	public async renameFile(@Param() params: RenameFileParams, @Body() body: RenameFileBody): Promise<void> {
		await this.fileService.renameFileOrThrow(params.id, body.name);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@FileOpenApi.DeleteFile
	public async deleteFile(@Param() params: DeleteFileParams): Promise<void> {
		await this.fileService.deleteFileOrThrow(params.id);
	}
}
