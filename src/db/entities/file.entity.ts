/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Entity, EntityRepositoryType, ManyToOne, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';

import { EntityRepository } from '@mikro-orm/mariadb';
import { Directory } from 'src/db/entities/directory.entity';
import { v4 } from 'uuid';
import { User } from './user.entitiy';

export class FileRepository extends EntityRepository<File> {}

export const FILES_TABLE_NAME = 'files';

@Entity({ tableName: FILES_TABLE_NAME, repository: () => FileRepository })
@Unique({ properties: ['parent', 'name'] })
export class File {
	public [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';
	public [EntityRepositoryType]?: FileRepository;

	@PrimaryKey({ type: 'uuid', nullable: false, defaultRaw: 'UUID()', unique: true })
	public readonly id: string = v4();

	@Property({ type: 'varchar', nullable: false })
	public readonly name!: string;

	@ManyToOne({ entity: () => Directory, nullable: false, updateRule: 'no action', deleteRule: 'cascade', name: 'parentId' })
	public readonly parent!: Directory;

	@Property({ type: 'varchar', nullable: false })
	public readonly mimeType!: string;

	@Property({ type: 'bigint', nullable: false })
	public readonly size!: number;

	@Property({ type: 'datetime', nullable: false, defaultRaw: 'current_timestamp()' })
	public readonly createdAt!: Date;

	@Property({ type: 'datetime', nullable: false, defaultRaw: 'current_timestamp()', extra: 'on update current_timestamp()' })
	public readonly updatedAt!: Date;

	@ManyToOne({
		entity: () => User,
		nullable: false,
		updateRule: 'no action',
		deleteRule: 'cascade',
		referenceColumnName: 'id'
	})
	public readonly user!: User;
}
