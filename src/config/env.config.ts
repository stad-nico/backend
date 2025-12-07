/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

export enum NodeEnv {
	DEVELOP = 'dev',
	PRODUCTION = 'prod',
	TESTING = 'test',
}

class EnvironmentVariables {
	@Type(() => Number)
	@IsNumber()
	PORT!: number;

	@IsString()
	STORAGE_PATH!: string;

	@IsEnum(NodeEnv)
	NODE_ENV!: NodeEnv;

	@IsString()
	DB_NAME!: string;

	@IsString()
	DB_PASSWORD!: string;

	@IsString()
	DB_URL!: string;

	@IsString()
	JWT_REFRESH_SECRET!: string;

	@IsString()
	JWT_ACCESS_SECRET!: string;
}

export enum Environment {
	PORT = 'PORT',
	STORAGE_PATH = 'STORAGE_PATH',
	NODE_ENV = 'NODE_ENV',
	DB_NAME = 'DB_NAME',
	DB_PASSWORD = 'DB_PASSWORD',
	DB_URL = 'DB_URL',
	JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
	JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',
	SKIP_ENV_VALIDATION = 'SKIP_ENV_VALIDATION',
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
	const mergedConfig = { ...process.env, ...config };

	if (mergedConfig[Environment.SKIP_ENV_VALIDATION] === 'true') {
		return mergedConfig as unknown as EnvironmentVariables;
	}

	mergedConfig.NODE_ENV = mergedConfig.NODE_ENV ?? NodeEnv.DEVELOP;

	const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors[0]?.toString());
	}

	return validatedConfig;
}
