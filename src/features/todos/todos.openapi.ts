/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SomethingWentWrongException } from 'src/shared/exceptions/SomethingWentWrongException';
import { TemplatedApiException } from 'src/util/openapi.utils';
import { CreateTodoResponse } from './dtos/create/create-todo.response';
import { GetAllTodosResponse } from './dtos/get-all/get-all-todos.response';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

export const Controller = applyDecorators(ApiTags('todos'), ApiBearerAuth());

export const GetAllTodos = applyDecorators(
	ApiOperation({ operationId: 'getAllTodos', summary: 'Get all todos', description: 'Get all todos for the user' }),
	ApiOkResponse({ type: GetAllTodosResponse, description: 'The todos were retrieved successfully' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const CreateTodo = applyDecorators(
	ApiOperation({ operationId: 'createTodo', summary: 'Create todo', description: 'Create a new todo' }),
	ApiCreatedResponse({ type: CreateTodoResponse, description: 'The todo was created successfully' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);

export const UpdateTodo = applyDecorators(
	ApiOperation({ operationId: 'updateTodo', summary: 'Update todo', description: 'Update an existing todo' }),
	ApiOkResponse({ description: 'The todo was updated successfully' }),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' }),
	TemplatedApiException(() => TodoNotFoundException.fromId('3c356389-dd1a-4c77-bc1b-7ac75f34d04d'), {
		description: 'The todo does not exist'
	})
);

export const DeleteTodo = applyDecorators(
	ApiOperation({ operationId: 'deleteTodo', summary: 'Delete todo', description: 'Delete the todo with the given id' }),
	ApiNoContentResponse({ description: 'The todo was deleted successfully' }),
	TemplatedApiException(() => TodoNotFoundException.fromId('853d4b18-8d1a-426c-b53e-74027ce1644b'), {
		description: 'The todo does not exist'
	}),
	TemplatedApiException(() => SomethingWentWrongException, { description: 'Unexpected error' })
);
