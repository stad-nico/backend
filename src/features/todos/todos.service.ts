import { Transactional } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Todo, TodoRepository } from 'src/db/entities/todo.entity';
import { TodoNotFoundException } from './exceptions/todo-not-found.exception';

@Injectable()
export class TodoService {
	constructor(private readonly todoRepository: TodoRepository) {}

	/**
	 * Get a todo by its id
	 *
	 * @throws TodoNotFoundException if the todo does not exist
	 *
	 * @param id the id of the todo
	 * @returns the todo
	 */
	public async getTodoByIdOrThrow(id: string): Promise<Todo> {
		const maybeTodo = await this.todoRepository.findOne({ id });

		if (!maybeTodo) {
			throw TodoNotFoundException.fromId(id);
		}

		return maybeTodo;
	}

	/**
	 * Get all todos for a user
	 *
	 * @param userId the id of the user
	 * @returns the todos of the user
	 */
	@Transactional()
	public async getTodosByUserId(userId: string): Promise<Array<Todo>> {
		return await this.todoRepository.findAll({ where: { user: userId } });
	}

	/**
	 * Creates a new todo
	 *
	 * @param userId the id of the user
	 * @param title the title of the todo
	 * @param description the description of the todo
	 * @param dueBy the due date of the todo
	 * @returns the id of the created todo
	 */
	@Transactional()
	public async createTodo(userId: string, title: string, description: string | null, dueBy: Date | null): Promise<string> {
		const { id } = this.todoRepository.create({ title, description, dueBy, user: userId });

		return id;
	}

	/**
	 * Updates an existing todo
	 *
	 * @throws TodoNotFoundException if the todo does not exist
	 *
	 * @param id the id of the todo
	 * @param todo the todo to update
	 */
	@Transactional()
	public async updateTodoOrThrow(id: string, todo: Partial<Todo>): Promise<void> {
		const maybeTodo = await this.todoRepository.findOne({ id });

		if (!maybeTodo) {
			throw TodoNotFoundException.fromId(id);
		}

		await this.todoRepository.nativeUpdate({ id }, todo);
	}

	/**
	 * Deletes a todo
	 *
	 * @throws TodoNotFoundException if the todo does not exist
	 *
	 * @param id the id of the todo
	 */
	@Transactional()
	public async deleteTodoOrThrow(id: string): Promise<void> {
		const maybeTodo = await this.todoRepository.findOne({ id });

		if (!maybeTodo) {
			throw TodoNotFoundException.fromId(id);
		}

		await this.todoRepository.nativeDelete({ id });
	}
}
