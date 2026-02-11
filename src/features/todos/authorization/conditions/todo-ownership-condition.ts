import { Todo } from 'src/db/entities/todo.entity';

interface TodoOwnershipConditionContext {
	userId: string;
	todo: Todo;
}

export async function TodoOwnershipCondition(context: TodoOwnershipConditionContext): Promise<boolean> {
	const { userId, todo } = context;

	return todo.user.id === userId;
}
