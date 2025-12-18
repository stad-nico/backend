/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Entity, EntityRepositoryType, ManyToOne, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { DirectoryRepository } from 'src/db/repositories/directory.repository';
import { v4 } from 'uuid';
import { User } from './user.entitiy';

export const ROOT_ID = 'root';
export const DIRECTORY_TABLE_NAME = 'directories';

@Entity({ tableName: DIRECTORY_TABLE_NAME, repository: () => DirectoryRepository })
@Unique({ properties: ['parent', 'name'] })
export class Directory {
	public [OptionalProps]?: 'id' | 'parent' | 'createdAt' | 'updatedAt';
	public [EntityRepositoryType]?: DirectoryRepository;

	@PrimaryKey({ type: 'uuid', nullable: false, defaultRaw: 'UUID()', unique: true })
	public readonly id: string = v4();

	@Property({ type: 'varchar', nullable: false })
	public readonly name!: string;

	@ManyToOne({
		entity: () => Directory,
		nullable: true,
		default: null,
		updateRule: 'no action',
		deleteRule: 'cascade',
		name: 'parentId',
		serializer: (directory: Directory) => directory.id,
		serializedName: 'parentId'
	})
	public readonly parent!: Directory | null;

	@Property({ type: 'datetime', nullable: false, defaultRaw: 'current_timestamp()' })
	public readonly createdAt!: Date;

	@Property({ type: 'datetime', nullable: false, defaultRaw: 'current_timestamp()', extra: 'on update current_timestamp()' })
	public readonly updatedAt!: Date;

	@ManyToOne({
		entity: () => User,
		nullable: false,
		updateRule: 'no action',
		deleteRule: 'cascade',
		name: 'userId',
		referenceColumnName: 'id'
	})
	public readonly user!: User;
}
