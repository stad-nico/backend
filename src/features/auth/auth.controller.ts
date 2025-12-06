/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthOpenApi } from 'src/features/auth/auth.openapi';
import { LoginBody } from 'src/features/auth/mapping/login/login.body';
import { LoginResponse } from 'src/features/auth/mapping/login/login.response';
import { RefreshResponse } from 'src/features/auth/mapping/refresh/refresh.response';
import { Public } from 'src/shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { RefreshBody } from './mapping/refresh/refresh.body';

@Controller('auth')
@AuthOpenApi.Controller
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@AuthOpenApi.Login
	public async login(@Body() body: LoginBody): Promise<LoginResponse> {
		const { accessToken, refreshToken } = await this.authService.loginOrThrow(body.username, body.password);

		return LoginResponse.fromTokens(accessToken, refreshToken);
	}

	@Post('refresh')
	@Public()
	@HttpCode(HttpStatus.OK)
	@AuthOpenApi.Refresh
	public async refresh(@Body() body: RefreshBody): Promise<RefreshResponse> {
		const { accessToken, refreshToken } = await this.authService.refreshOrThrow(body.refreshToken);

		return RefreshResponse.from(accessToken, refreshToken);
	}
}
