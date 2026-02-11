import { UnauthorizedException } from '@nestjs/common';
import { Query } from 'role-acl';
import { AuthorizationCondition } from './authorization-condition';

/**
 * Fluent interface wrapper around `Query` for querying authorization.
 * This ensures that the methods are called in the correct order:
 *
 * @example
 * ```ts
 * await this.authorization
 *  .can(user)
 *  .execute(TodoAction.UPDATE)
 *  .on(Resource.TODO)
 *  .withCondition(TodoOwnershipCondition, { userId: user.id, todo })
 *  .throwIfUnauthorized();
 * ```
 */

export interface AuthorizationQueryExecute {
	/**
	 * Sets the action for this authorization query.
	 *
	 * @param action the action to check
	 * @returns the next step in the fluent interface
	 */
	execute(action: string): AuthorizationQueryResource;
}

interface AuthorizationQueryResource {
	/**
	 * Sets the resource for this authorization query.
	 *
	 * @param resource the resource to check
	 * @returns the next step in the fluent interface
	 */
	on(resource: string): AuthorizationQueryCondition & AuthorizationQueryThrow;
}

interface AuthorizationQueryCondition {
	/**
	 * Sets the condition for this authorization query.
	 *
	 * @param condition the condition to check
	 * @param context the context to pass to the condition
	 * @returns the next step in the fluent interface
	 */
	withCondition<Context>(condition: AuthorizationCondition<Context>, context: Context): AuthorizationQueryThrow;
}

interface AuthorizationQueryThrow {
	/**
	 * Throws an `UnauthorizedException` if the authorization query fails.
	 */
	throwIfUnauthorized(): void;
}

export class AuthorizationQuery
	implements AuthorizationQueryExecute, AuthorizationQueryResource, AuthorizationQueryCondition, AuthorizationQueryThrow
{
	private readonly accessControlQuery: Query;

	constructor(accessControlQuery: Query) {
		this.accessControlQuery = accessControlQuery;
	}

	public execute(action: string): this {
		this.accessControlQuery.execute(action);

		return this;
	}

	public on(resource: string): this {
		this.accessControlQuery.resource(resource);

		return this;
	}

	public withCondition<Context>(condition: AuthorizationCondition<Context>, context: Context): this {
		return this;
	}

	public throwIfUnauthorized(): void {
		throw new UnauthorizedException();
	}
}
