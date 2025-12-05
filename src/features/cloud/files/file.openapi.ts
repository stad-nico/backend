/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { applyDecorators } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { DirectoryNotFoundException } from 'src/features/cloud/directories/exceptions/directory-not-found.exception';
import { FileAlreadyExistsException } from 'src/features/cloud/files/exceptions/file-already-exists.exception';
import { FileNameTooLongException } from 'src/features/cloud/files/exceptions/file-name-too-long.exception';
import { FileNotFoundException } from 'src/features/cloud/files/exceptions/file-not-found.exception';
import { InvalidFileNameException } from 'src/features/cloud/files/exceptions/invalid-file-name.exception';
import { GetFileMetadataResponse } from 'src/features/cloud/files/mapping/metadata/get-file-metadata.response';
import { UploadFileBody } from 'src/features/cloud/files/mapping/upload/upload-file.body';
import { UploadFileResponse } from 'src/features/cloud/files/mapping/upload/upload-file.response';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';

export namespace FileOpenApi {
	export const Controller = applyDecorators(ApiTags('files'), ApiBearerAuth());

	export const UploadFile = applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiBody({ description: 'File to upload', type: UploadFileBody }),
		ApiOperation({
			operationId: 'uploadFile',
			summary: 'Upload file',
			description: 'Upload a file and store it under the provided parent id',
		}),
		ApiCreatedResponse({ type: UploadFileResponse, description: 'The file was created successfully' }),
		TemplatedApiException(
			() => new FileNameTooLongException('thisNameIsWayTooLongSoYouWillReceiveAnErrorIfYouChooseSuchALongName.txt'),
			{ description: 'The file name is too long' }
		),
		TemplatedApiException(() => new InvalidFileNameException('&/8892mf--+&.txt'), { description: 'The file path is not valid' }),
		TemplatedApiException(() => DirectoryNotFoundException.fromId('3c356389-dd1a-4c77-bc1b-7ac75f34d04d'), {
			description: 'The parent directory does not exist',
		}),
		TemplatedApiException(() => FileAlreadyExistsException.fromName('example.txt'), { description: 'The file already exists' }),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const GetFileMetadata = applyDecorators(
		ApiOperation({
			operationId: 'getFileMetadata',
			summary: 'Get file metadata',
			description: 'Get the metadata of a file with the given id',
		}),
		ApiOkResponse({ type: GetFileMetadataResponse, description: 'The metadata was retrieved successfully' }),
		TemplatedApiException(() => FileNotFoundException.fromId('3c356389-dd1a-4c77-bc1b-7ac75f34d04d'), {
			description: 'The file does not exist',
		}),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const DownloadFile = applyDecorators(
		ApiOperation({ operationId: 'downloadFile', summary: 'Download file', description: 'Download a file with the given id' }),
		ApiOkResponse({
			content: { '*/*': { schema: { type: 'string', format: 'binary' } } },
			description: 'The file was downloaded successfully',
		}),
		TemplatedApiException(() => FileNotFoundException.fromId('3c356389-dd1a-4c77-bc1b-7ac75f34d04d'), {
			description: 'The file does not exist',
		}),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const RenameFile = applyDecorators(
		ApiOperation({ operationId: 'renameFile', summary: 'Rename file', description: 'Rename the file with the given id' }),
		ApiNoContentResponse({ description: 'The file was renamed successfully' }),
		TemplatedApiException(
			() => new FileNameTooLongException('thisNameIsWayTooLongSoYouWillReceiveAnErrorIfYouChooseSuchALongName.txt'),
			{ description: 'The file name is too long' }
		),
		TemplatedApiException(() => new InvalidFileNameException('/$()§..fw'), { description: 'The file name is not valid' }),
		TemplatedApiException(() => FileNotFoundException.fromId('853d4b18-8d1a-426c-b53e-74027ce1644b'), {
			description: 'The file does not exist',
		}),
		TemplatedApiException(() => FileAlreadyExistsException.fromName('example.txt'), { description: 'The file already exists' }),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const DeleteFile = applyDecorators(
		ApiOperation({ operationId: 'deleteFile', summary: 'Delete file', description: 'Delete the file with the given id' }),
		ApiNoContentResponse({ description: 'The file was deleted successfully' }),
		TemplatedApiException(() => FileNotFoundException.fromId('853d4b18-8d1a-426c-b53e-74027ce1644b'), {
			description: 'The file does not exist',
		}),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);
}
