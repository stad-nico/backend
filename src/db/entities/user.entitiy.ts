/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Entity, EntityRepository, EntityRepositoryType, HiddenProps, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export class UserRepository extends EntityRepository<User> {}

@Entity({ tableName: 'users', repository: () => UserRepository })
export class User {
	[OptionalProps]?: 'id' | 'createdAt' | 'lastLogin';
	[EntityRepositoryType]?: UserRepository;
	[HiddenProps]?: 'password';

	@PrimaryKey({
		type: 'uuid',
		nullable: false,
		unique: true,
		defaultRaw: 'UUID()',
	})
	readonly id: string = v4();

	@Property({ type: 'varchar', nullable: false, unique: true })
	readonly username!: string;

	@Property({ type: 'varchar', nullable: false, hidden: true })
	readonly password!: string;

	@Property({
		type: 'datetime',
		nullable: false,
		defaultRaw: 'current_timestamp()',
	})
	readonly createdAt!: Date;

	@Property({ type: 'datetime', nullable: true, default: null })
	readonly lastLogin!: Date | null;
}
