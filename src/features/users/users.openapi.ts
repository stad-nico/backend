/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAlreadyExistsException } from 'src/features/users/exceptions/user-already-exists.exception';
import { UserNotFoundException } from 'src/features/users/exceptions/user-not-found.exception';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';

export namespace UserOpenApi {
	export const Controller = applyDecorators(ApiTags('users'), ApiBearerAuth());

	export const GetUser = applyDecorators(
		ApiOperation({ operationId: 'getUser', summary: 'Get user', description: 'Get information about the user' }),
		ApiOkResponse({ description: 'The user metadata was retreived successfully' }),
		TemplatedApiException(() => UserNotFoundException.fromId('133a8736-111a-4cf7-ae84-dbe040ad4382'), {
			description: 'The user does not exist',
		}),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const CreateUser = applyDecorators(
		ApiOperation({ operationId: 'createUser', summary: 'Create user', description: 'Register a new user' }),
		ApiCreatedResponse({ description: 'The user was created successfully' }),
		TemplatedApiException(() => UserAlreadyExistsException.fromUsername('exampleUser'), {
			description: 'User with this username already exists',
		}),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);
}
