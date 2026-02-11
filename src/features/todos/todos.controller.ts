import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { User } from 'src/db/entities/user.entitiy';
import { User as UserDecorator } from 'src/shared/decorators/user.decorator';
import { CreateTodoBody } from './dtos/create/create-todo.body';
import { CreateTodoResponse } from './dtos/create/create-todo.response';
import { DeleteTodoParams } from './dtos/delete/delete-todo.params';
import { GetAllTodosResponse } from './dtos/get-all/get-all-todos.response';
import { UpdateTodoBody } from './dtos/update/update-todo.body';
import { UpdateTodoParams } from './dtos/update/update-todo.param';
import * as TodoOpenApi from './todos.openapi';
import { TodoService } from './todos.service';

@Controller('todos')
@TodoOpenApi.Controller
export class TodoController {
	constructor(
		private readonly todoService: TodoService
		// private readonly authorization: Authorization
	) {}

	@Get('/all')
	@HttpCode(HttpStatus.OK)
	@TodoOpenApi.GetAllTodos
	public async getTodos(@UserDecorator() user: User): Promise<GetAllTodosResponse> {
		const { id: userId } = user;

		const todos = await this.todoService.getTodosByUserId(userId);

		return GetAllTodosResponse.fromTodos(todos);
	}

	@Post('/create')
	@HttpCode(HttpStatus.CREATED)
	@TodoOpenApi.CreateTodo
	public async createTodo(@UserDecorator() user: User, @Body() body: CreateTodoBody): Promise<CreateTodoResponse> {
		const { id: userId } = user;

		const { title, description, dueBy } = body;

		const todoId = await this.todoService.createTodo(userId, title, description, dueBy);

		return CreateTodoResponse.fromId(todoId);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@TodoOpenApi.UpdateTodo
	public async updateTodo(@UserDecorator() user: User, @Param() params: UpdateTodoParams, @Body() body: UpdateTodoBody): Promise<void> {
		// const todo = await this.todoService.getTodoByIdOrThrow(params.id);

		// await this.authorization
		// 	.can(user)
		// 	.execute(TodoAction.UPDATE)
		// 	.on(Resource.TODO)
		// 	.withCondition(TodoOwnershipCondition, { userId: user.id, todo })
		// 	.throwIfUnauthorized();

		await this.todoService.updateTodoOrThrow(params.id, body);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@TodoOpenApi.DeleteTodo
	public async deleteTodo(@UserDecorator() user: User, @Param() params: DeleteTodoParams): Promise<void> {
		// const todo = await this.todoService.getTodoByIdOrThrow(params.id);

		// await this.authorization
		// 	.can(user)
		// 	.execute(TodoAction.DELETE)
		// 	.on(Resource.TODO)
		// 	.withCondition(TodoOwnershipCondition, { userId: user.id, todo })
		// 	.throwIfUnauthorized();

		await this.todoService.deleteTodoOrThrow(params.id);
	}
}
