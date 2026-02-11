import { Authorization } from 'src/modules/authorization/authorization';
import { Resource } from 'src/modules/authorization/resources';
import { TodoAction } from './actions';
import { TodoOwnershipCondition } from './conditions/todo-ownership-condition';
import { TodoPermission } from './permissions';

export function grantTodoPermissions(authorization: Authorization): void {
	authorization.grant([TodoPermission.READ]).action(TodoAction.READ).on(Resource.TODO);
	authorization.grant([TodoPermission.CREATE]).action(TodoAction.CREATE).on(Resource.TODO);

	authorization.grant([TodoPermission.UPDATE_OWN]).action(TodoAction.UPDATE).condition(TodoOwnershipCondition).on(Resource.TODO);
	authorization.grant([TodoPermission.DELETE_OWN]).action(TodoAction.DELETE).condition(TodoOwnershipCondition).on(Resource.TODO);
}
