import { AccessControl } from 'role-acl';
import { User } from 'src/db/entities/user.entitiy';
import { AuthorizationGrant, AuthorizationGrantAction } from './authorization-grant';
import { AuthorizationQuery, AuthorizationQueryExecute } from './authorization-query';

export class Authorization {
	private readonly accessControl = new AccessControl();

	/**
	 * Starts a new authorization grant query
	 * using fluent builder api pattern.
	 *
	 * @param permissions the permissions to grant
	 * @returns authorization grant fluent interface
	 */
	public grant(permissions: Array<string>): AuthorizationGrantAction {
		const access = this.accessControl.grant(permissions);

		return new AuthorizationGrant(access);
	}

	/**
	 * Starts a new authorization query for the given user
	 * using fluent builder api pattern.
	 *
	 * @param user the user to check permissions for
	 * @returns authorization query fluent interface
	 */
	public can(user: User): AuthorizationQueryExecute {
		const query = this.accessControl.can(user.id);

		return new AuthorizationQuery(query);
	}
}
