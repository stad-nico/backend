/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Transactional } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Environment } from 'src/config/env.config';
import { UserRepository } from 'src/db/entities/user.entitiy';
import { IncorrectPasswordException } from 'src/features/auth/exceptions/incorrect-password.exception';
import { SessionExpiredException } from 'src/features/auth/exceptions/session-expired.exception';
import { UserService } from 'src/features/users/users.service';
import { JwtPayload } from 'src/shared/types/jwt-payload';

@Injectable()
export class AuthService {
	/**
	 * The expiration time of the access token.
	 */
	private static readonly ACCESS_TOKEN_EXPIRATION = '1h';

	/**
	 * The expiration time of the refresh token.
	 */
	private static readonly REFRESH_TOKEN_EXPIRATION = '7d';

	/**
	 * The maximum duration of a session. If a user tries to refresh its token and his
	 * last login was more than this duration ago, he will be forced to log in again.
	 * The duration is in milliseconds (30 days).
	 */
	private static readonly MAX_SESSION_DURATION = 1000 * 60 * 60 * 24 * 30;

	constructor(
		private readonly userRepository: UserRepository,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {}

	@Transactional()
	public async loginOrThrow(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
		const user = await this.userService.getUserByUsernameOrThrow(username);

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			throw new IncorrectPasswordException();
		}

		await this.userRepository.nativeUpdate({ id: user.id }, { lastLogin: new Date() });

		return this.createTokens(user.id, user.username);
	}

	@Transactional()
	public async refreshOrThrow(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
		const secret = this.configService.getOrThrow<string>(Environment.JWT_REFRESH_SECRET);

		const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, { secret });

		const user = await this.userService.getUserByIdOrThrow(payload.user.id);

		if (!user.lastLogin || Date.now() - user.lastLogin.getTime() > AuthService.MAX_SESSION_DURATION) {
			throw new SessionExpiredException();
		}

		return this.createTokens(user.id, user.username);
	}

	private async createTokens(id: string, username: string): Promise<{ accessToken: string; refreshToken: string }> {
		const jwtPayload: JwtPayload = { user: { id, username } };

		const accessToken = await this.jwtService.signAsync(jwtPayload, {
			secret: this.configService.getOrThrow<string>(Environment.JWT_ACCESS_SECRET),
			expiresIn: AuthService.ACCESS_TOKEN_EXPIRATION,
		});

		const refreshToken = await this.jwtService.signAsync(jwtPayload, {
			secret: this.configService.getOrThrow<string>(Environment.JWT_REFRESH_SECRET),
			expiresIn: AuthService.REFRESH_TOKEN_EXPIRATION,
		});

		return { accessToken, refreshToken };
	}
}
