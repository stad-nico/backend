/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DirectoryAlreadyExistsException } from 'src/features/cloud/directories/exceptions/directory-already-exists.exception';
import { DirectoryNameTooLongException } from 'src/features/cloud/directories/exceptions/directory-name-too-long.exception';
import { DirectoryNotFoundException } from 'src/features/cloud/directories/exceptions/directory-not-found.exception';
import { InvalidDirectoryNameException } from 'src/features/cloud/directories/exceptions/invalid-directory-name.exception';
import { RootCannotBeDeletedException } from 'src/features/cloud/directories/exceptions/root-cannot-be-deleted.exception';
import { RootCannotBeRenamedException } from 'src/features/cloud/directories/exceptions/root-cannot-be-renamed.exception';
import { GetDirectoryContentsResponse } from 'src/features/cloud/directories/mapping/contents/get-directory-contents.response';
import { GetDirectoryMetadataResponse } from 'src/features/cloud/directories/mapping/metadata/get-directory-metadata.response';
import { GetDirectoryRootResponse } from 'src/features/cloud/directories/mapping/root/get-directory-root.response';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';
import { CreateDirectoryResponse } from './mapping/create/create-directory.response';

export const Controller = applyDecorators(ApiTags('directory'), ApiBearerAuth());

export const CreateDirectory = applyDecorators(
	ApiOperation({
		operationId: 'createDirectory',
		summary: 'Create directory',
		description: 'Create a directory with the given name under the given parent id'
	}),
	ApiCreatedResponse({ type: CreateDirectoryResponse, description: 'The directory was created successfully' }),
	TemplatedApiException(() => new DirectoryNameTooLongException('thisNameIsWayTooLongSoYouWillReceiveAnErrorIfYouChooseSuchALongName'), {
		description: 'The directory name is too long'
	}),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('133a8736-111a-4cf7-ae84-dbe040ad4382'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => new InvalidDirectoryNameException('%&/("§.*'), { description: 'The directory name is not valid' }),
	TemplatedApiException(() => DirectoryAlreadyExistsException.fromName('example'), { description: 'The directory already exists' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const GetDirectoryRoot = applyDecorators(
	ApiOperation({
		operationId: 'getDirectoryRoot',
		summary: 'Get root id',
		description: 'Get the id of the root directory for the current user'
	}),
	ApiOkResponse({ type: GetDirectoryRootResponse, description: 'The root was retreived successfully' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const GetDirectoryContents = applyDecorators(
	ApiOperation({
		operationId: 'getDirectoryContents',
		summary: 'Get directory contents',
		description: 'Get the files and directories'
	}),
	ApiOkResponse({ type: GetDirectoryContentsResponse, description: 'The contents were retrieved successfully' }),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('133a8736-111a-4cf7-ae84-dbe040ad4382'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const GetDirectoryMetadata = applyDecorators(
	ApiOperation({
		operationId: 'getDirectoryMetadata',
		summary: 'Get directory metadata',
		description: 'Get the metadata of a directory'
	}),
	ApiOkResponse({ type: GetDirectoryMetadataResponse, description: 'The metadata was retrieved successfully' }),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('133a8736-111a-4cf7-ae84-dbe040ad4382'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const DownloadDirectory = applyDecorators(
	ApiOperation({
		operationId: 'downloadDirectory',
		summary: 'Download directory',
		description: 'Download the directory as a ZIP archive'
	}),
	ApiOkResponse({
		content: { '*/*': { schema: { type: 'string', format: 'binary' } } },
		description: 'The directory was downloaded successfully'
	}),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('133a8736-111a-4cf7-ae84-dbe040ad4382'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const RenameDirectory = applyDecorators(
	ApiOperation({ operationId: 'renameDirectory', summary: 'Rename directory', description: 'Rename or move a directory' }),
	ApiNoContentResponse({ description: 'The directory was renamed successfully' }),
	TemplatedApiException(() => new InvalidDirectoryNameException('%26path&'), { description: 'The directory name is not valid' }),
	TemplatedApiException(() => new DirectoryNameTooLongException('thisNameIsWayTooLongSoYouWillReceiveAnErrorIfYouChooseSuchALongName'), {
		description: 'The directory name is too long'
	}),
	TemplatedApiException(() => RootCannotBeRenamedException, { description: 'The root directory cannot be renamed' }),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('9bb14df7-112b-486a-bd49-8261246ad256'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => DirectoryAlreadyExistsException.fromName('renamed'), {
		description: 'The destination directory already exists'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const DeleteDirectory = applyDecorators(
	ApiOperation({
		operationId: 'deleteDirectory',
		summary: 'Delete directory',
		description: 'Delete the directory with the given id including all files and subdirectories'
	}),
	ApiNoContentResponse({ description: 'The directory was deleted successfully' }),
	TemplatedApiException(() => RootCannotBeDeletedException, { description: 'The root directory cannot be deleted' }),
	TemplatedApiException(() => DirectoryNotFoundException.fromId('9bb14df7-112b-486a-bd49-8261246ad256'), {
		description: 'The directory does not exist'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);
