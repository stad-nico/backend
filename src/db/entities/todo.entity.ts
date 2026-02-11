/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Entity, EntityRepository, EntityRepositoryType, Enum, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entitiy';

export class TodoRepository extends EntityRepository<Todo> {}

export enum TodoStatus {
	PENDING = 'pending',
	COMPLETED = 'completed'
}

@Entity({ tableName: 'todos', repository: () => TodoRepository })
export class Todo {
	public [EntityRepositoryType]?: TodoRepository;
	public [OptionalProps]?: 'id' | 'createdAt' | 'completedAt' | 'dueBy' | 'description' | 'status';

	@PrimaryKey({
		type: 'uuid',
		nullable: false,
		unique: true,
		defaultRaw: 'UUID()'
	})
	public readonly id: string = v4();

	@Property({ type: 'varchar', nullable: false })
	public readonly title!: string;

	@Property({ type: 'varchar', nullable: true, default: null })
	public readonly description!: string | null;

	@Property({ type: 'datetime', nullable: false, defaultRaw: 'current_timestamp()' })
	public readonly createdAt!: Date;

	@Property({ type: 'datetime', nullable: true, default: null })
	public readonly completedAt!: Date | null;

	@Property({ type: 'datetime', nullable: true, default: null })
	public readonly dueBy!: Date | null;

	@Enum({ items: () => TodoStatus, nullable: false, default: TodoStatus.PENDING })
	public readonly status!: TodoStatus;

	@ManyToOne({
		entity: () => User,
		nullable: false,
		updateRule: 'no action',
		deleteRule: 'cascade',
		referenceColumnName: 'id',
		name: 'userId'
	})
	public readonly user!: User;
}
