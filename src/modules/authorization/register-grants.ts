import { INestApplication } from '@nestjs/common';
import { grantTodoPermissions } from 'src/features/todos/authorization/grants';
import { Authorization } from './authorization';

const GRANT_FUNCTIONS = [grantTodoPermissions];

/**
 * Register the authorization grants for all features.
 *
 * @param application the nestjs application
 */
export function registerGrants(application: INestApplication): void {
	const authorization = application.get(Authorization);

	for (const grantFeaturePermissions of GRANT_FUNCTIONS) {
		grantFeaturePermissions(authorization);
	}
}
