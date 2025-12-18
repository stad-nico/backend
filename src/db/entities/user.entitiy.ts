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
	public [OptionalProps]?: 'id' | 'createdAt' | 'lastLogin';
	public [EntityRepositoryType]?: UserRepository;
	public [HiddenProps]?: 'password';

	@PrimaryKey({
		type: 'uuid',
		nullable: false,
		unique: true,
		defaultRaw: 'UUID()'
	})
	public readonly id: string = v4();

	@Property({ type: 'varchar', nullable: false, unique: true })
	public readonly username!: string;

	@Property({ type: 'varchar', nullable: false, hidden: true })
	public readonly password!: string;

	@Property({
		type: 'datetime',
		nullable: false,
		defaultRaw: 'current_timestamp()'
	})
	public readonly createdAt!: Date;

	@Property({ type: 'datetime', nullable: true, default: null })
	public readonly lastLogin!: Date | null;
}
