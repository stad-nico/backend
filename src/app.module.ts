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
import { Directory } from 'src/db/entities/directory.entity';
import { User } from 'src/db/entities/user.entitiy';
import { AuthModule } from 'src/features/auth/auth.module';
import { CloudModule } from 'src/features/cloud/cloud.module';
import { UsersModule } from 'src/features/users/users.module';
import { DiskModule } from 'src/modules/disk/disk.module';
import { JwtGuard } from 'src/shared/guards/jwt.guard';

export const AppModuleConfig = {
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config.env`,
			expandVariables: true,
			validate: validate,
		}),

		JwtModule.register({ global: true, verifyOptions: { ignoreNotBefore: true } }),

		MikroOrmModule.forRoot(),
		MikroOrmModule.forFeature([User, Directory]),

		DiskModule.forRootAsync(),

		AuthModule,

		CloudModule,

		UsersModule,
	],
	providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
};
@Module(AppModuleConfig)
export class AppModule {}
