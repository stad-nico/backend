/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { configureApplication } from 'src/config/app.config';
import { Environment } from 'src/config/env.config';
import { registerGrants as registerAuthorizationGrants } from 'src/modules/authorization/register-grants';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const application = await NestFactory.create(AppModule, {
		bufferLogs: true
	});

	configureApplication(application);

	registerAuthorizationGrants(application);

	const configService = application.get(ConfigService);
	await application.listen(+configService.get(Environment.PORT));
}

bootstrap().catch((error: unknown) => {
	throw error;
});
