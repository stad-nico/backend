import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Todo, TodoStatus } from 'src/db/entities/todo.entity';

export class TodoResponse {
	@ApiProperty({ description: 'The id of the todo', type: 'string', example: '133a8736-111a-4cf7-ae84-dbe040ad4382' })
	public readonly id: string;

	@ApiProperty({ description: 'The title of the todo', type: 'string', example: 'Buy groceries' })
	public readonly title: string;

	@ApiProperty({ description: 'The description of the todo', type: 'string', example: 'Milk, Bread, Eggs', nullable: true })
	public readonly description: string | null;

	@ApiProperty({ description: 'The creation date of the todo', type: 'string', format: 'Date', example: '2024-05-05 17:37:33' })
	public readonly createdAt: Date;

	@ApiProperty({ description: 'The status of the todo', type: 'string', example: TodoStatus.PENDING, enum: TodoStatus })
	public readonly status: TodoStatus;

	@ApiProperty({
		description: 'The completion date of the todo',
		type: 'string',
		format: 'Date',
		example: '2024-05-05 17:37:33',
		nullable: true
	})
	public readonly completedAt: Date | null;

	@ApiProperty({
		description: 'The due date of the todo',
		type: 'string',
		format: 'Date',
		example: '2024-05-05 17:37:33',
		nullable: true
	})
	public readonly dueBy: Date | null;

	constructor(
		id: string,
		title: string,
		description: string | null,
		createdAt: Date,
		completedAt: Date | null,
		dueBy: Date | null,
		status: TodoStatus = TodoStatus.PENDING
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.createdAt = createdAt;
		this.completedAt = completedAt;
		this.dueBy = dueBy;
		this.status = status;
	}

	public static fromTodo(todo: Todo): TodoResponse {
		return new TodoResponse(todo.id, todo.title, todo.description, todo.createdAt, todo.completedAt, todo.dueBy);
	}
}

export class GetAllTodosResponse {
	@ApiProperty({ type: TodoResponse, isArray: true, description: 'The list of todos' })
	public readonly todos: Array<TodoResponse>;

	private constructor(todos: Array<TodoResponse>) {
		this.todos = todos;
	}

	public static fromTodos(todos: Array<Todo>): GetAllTodosResponse {
		return new GetAllTodosResponse(todos.map((todo) => TodoResponse.fromTodo(todo)));
	}
}
