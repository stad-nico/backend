import { Access } from 'role-acl';
import { AuthorizationCondition } from './authorization-condition';

/**
 * Fluent interface wrapper around `Access` for defining authorization grants.
 * This ensures that the methods are called in the correct order:
 *
 * @example
 * ```ts
 * authorization
 *  .grant(permission)
 *  .action(action)
 *  .condition(condition); // <-- optional
 *  .on(resource);
 * ```
 */

export interface AuthorizationGrantAction {
	/**
	 * Sets the action for this authorization grant.
	 *
	 * @param action the action to set
	 * @returns the next steps in the fluent interface
	 */
	action(action: string): AuthorizationGrantCondition & AuthorizationGrantResource;
}

interface AuthorizationGrantCondition {
	/**
	 * Sets the condition for this authorization grant.
	 *
	 * @param condition the condition to set
	 * @returns the next step in the fluent interface
	 */
	condition<Context>(condition: AuthorizationCondition<Context>): AuthorizationGrantResource;
}

interface AuthorizationGrantResource {
	/**
	 * Sets the resource for this authorization grant.
	 * This also commits the query.
	 *
	 * @param resource the resource to set
	 */
	on(resource: string): void;
}

export class AuthorizationGrant implements AuthorizationGrantAction, AuthorizationGrantResource, AuthorizationGrantCondition {
	private readonly access: Access;

	constructor(access: Access) {
		this.access = access;
	}

	public action(action: string): this {
		this.access.execute(action);

		return this;
	}

	public condition<Context>(condition: AuthorizationCondition<Context>): this {
		this.access.condition(condition);

		return this;
	}

	public on(resource: string): void {
		this.access.on(resource);
	}
}
