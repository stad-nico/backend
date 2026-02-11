/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { validate } from 'src/config/env.config';
import { CloudModule } from 'src/features/cloud/cloud.module';
import { UsersModule } from 'src/features/users/users.module';
import { DiskModule } from 'src/modules/disk/disk.module';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { AuthenticationModule } from './features/auth/auth.module';
import { TodoModule } from './features/todos/todos.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config.env`,
			expandVariables: true,
			validate
		}),

		JwtModule.register({ global: true, verifyOptions: { ignoreNotBefore: true } }),

		MikroOrmModule.forRoot(),

		DiskModule.forRootAsync(),

		AuthorizationModule,

		AuthenticationModule,

		CloudModule,

		UsersModule,

		TodoModule
	],
	providers: [{ provide: APP_GUARD, useClass: JwtGuard }]
})
export class AppModule {}
