/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';
import chalk from 'chalk';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { cwd } from 'process';
import { Environment } from '../src/config/env.config';

/**
 * Extracts module metadata such as controllers, providers, and imports.
 *
 * @param module the module to extract metadata from
 * @returns the module metadata
 */
function getModuleMetadata(module: Type<unknown>): {
	controllers: Array<Type<unknown>>;
	providers: Array<Type<unknown>>;
	imports: Array<Type<unknown>>;
} {
	return {
		controllers: (Reflect.getMetadata('controllers', module) ?? []) as Array<Type<unknown>>,
		providers: (Reflect.getMetadata('providers', module) ?? []) as Array<Type<unknown>>,
		imports: (Reflect.getMetadata('imports', module) ?? []) as Array<Type<unknown>>
	};
}

/**
 * Extracts the actual module from an import item, handling both static and dynamic modules.
 */
function extractImportedModule(importItem: unknown): Type<unknown> | undefined {
	if (!importItem) {
		return undefined;
	}

	if (typeof importItem === 'object' && 'module' in importItem) {
		return importItem.module as Type<unknown>;
	}

	if (typeof importItem === 'function') {
		return importItem as Type<unknown>;
	}

	return undefined;
}

/**
 * Traverse the module tree to collect all controllers and providers.
 */
function traverseModule(
	rootModule: Type<unknown>,
	visited = new Set<Type<unknown>>()
): { controllers: Array<Type<unknown>>; providers: Array<Type<unknown>>; modules: Array<Type<unknown>> } {
	const allControllers = new Set<Type<unknown>>();
	const allProviders = new Set<Type<unknown>>();
	const modules = new Set<Type<unknown>>();

	function traverse(module: Type<unknown>): void {
		if (visited.has(module)) return;
		visited.add(module);

		const { controllers, providers, imports } = getModuleMetadata(module);
		const hasControllers = controllers.length > 0;

		if (hasControllers) {
			modules.add(module);

			controllers.forEach((controller) => allControllers.add(controller));

			providers.forEach((provider) => allProviders.add(provider));
		}

		for (const importItem of imports) {
			const importedModule = extractImportedModule(importItem);
			if (importedModule) {
				traverse(importedModule);
			}
		}
	}

	traverse(rootModule);

	return {
		controllers: Array.from(allControllers),
		providers: Array.from(allProviders),
		modules: Array.from(modules)
	};
}

async function bootstrap(): Promise<void> {
	process.env[Environment.SKIP_ENV_VALIDATION] = 'true';
	const AppModule = await import('../src/app.module').then((m) => m.AppModule);

	console.log('🚀 Starting OpenAPI spec generation...\n');

	const mainModuleName = chalk.yellow(AppModule.name);
	console.log(`🔍 Traversing ${mainModuleName} to collect controllers and providers...\n`);
	const { controllers, providers, modules } = traverseModule(AppModule);

	const moduleCount = chalk.green(`${modules.length} modules`);
	const foundModules = chalk.yellow(`[${modules.map((module) => module.name).join(', ')}]`);
	const controllerCount = chalk.green(`${controllers.length} controllers`);
	console.log(`📦 Found ${moduleCount} ${foundModules} with a total of ${controllerCount}\n`);

	const moduleBuilder = Test.createTestingModule({ controllers, providers });

	console.log('🔧 Mocking providers...');
	for (const provider of providers) {
		moduleBuilder.overrideProvider(provider).useValue({});
	}
	console.log(chalk.green(`✓ Mocked ${providers.length} providers\n`));

	console.log('⚡ Starting application...\n');

	const moduleRef = await moduleBuilder.compile();
	const app = moduleRef.createNestApplication();

	const config = new DocumentBuilder()
		.addBearerAuth()
		.addServer('/api')
		.setTitle('PiCloud API')
		.setDescription('The API description')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	const endpoints = Object.keys(document.paths);
	console.log(`Found ${chalk.green(`${endpoints.length} endpoints:`)}\n`);

	for (const endpoint of endpoints) {
		const methods = Object.keys(document.paths[endpoint] ?? {})
			.map((method) => method.charAt(0).toUpperCase() + method.slice(1).toLowerCase())
			.sort()
			.join(', ');
		console.log(` - ${chalk.cyan(endpoint)} ${chalk.yellow(`[${methods}]`)} `);
	}

	console.log('\n📝 Writing OpenAPI specification...\n');

	const dirPath = 'openapi';
	const fileName = 'openapi.json';
	const fullPath = path.join(cwd(), dirPath, fileName);

	await mkdir(path.join(cwd(), dirPath), { recursive: true });
	await writeFile(fullPath, JSON.stringify(document, null, 2), 'utf-8');

	await app.close();

	console.log(chalk.green(`✅ Successfully generated and wrote OpenAPI spec to ${fullPath}!`));
}

void bootstrap();
