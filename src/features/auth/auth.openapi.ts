/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncorrectPasswordException } from 'src/features/auth/exceptions/incorrect-password.exception';
import { TokenExpiredException } from 'src/features/auth/exceptions/token-expired.exception';
import { LoginBody } from 'src/features/auth/mapping/login/login.body';
import { LoginResponse } from 'src/features/auth/mapping/login/login.response';
import { RefreshBody } from 'src/features/auth/mapping/refresh/refresh.body';
import { RefreshResponse } from 'src/features/auth/mapping/refresh/refresh.response';
import { UserNotFoundException } from 'src/features/users/exceptions/user-not-found.exception';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';

export namespace AuthOpenApi {
	export const Controller = applyDecorators(ApiTags('auth'), ApiBearerAuth());

	export const Login = applyDecorators(
		ApiBody({ description: 'The login credentials', type: LoginBody }),
		ApiOperation({
			operationId: 'login',
			summary: 'Login with password',
			description: 'Generate refresh and access token',
		}),
		ApiOkResponse({ type: LoginResponse, description: 'The login was successful' }),
		TemplatedApiException(() => UserNotFoundException.fromUsername('exampleUser'), { description: 'User does not exist' }),
		TemplatedApiException(() => IncorrectPasswordException, { description: 'The password was not correct' }),
		TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
	);

	export const Refresh = applyDecorators(
		ApiBody({ description: 'The refresh token', type: RefreshBody }),
		ApiOperation({
			operationId: 'refresh',
			summary: 'Refresh with refresh token',
			description: 'Generate new access and refresh token',
		}),
		ApiOkResponse({ type: RefreshResponse, description: 'new tokens generated' }),
		TemplatedApiException(() => UserNotFoundException.fromUsername('exampleUser'), { description: 'User does not exist' }),
		TemplatedApiException(() => TokenExpiredException, { description: 'The token has expired' })
	);
}
