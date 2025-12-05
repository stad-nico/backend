/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { Transactional } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { ROOT_ID } from 'src/db/entities/directory.entity';
import { User, UserRepository } from 'src/db/entities/user.entitiy';
import { DirectoryRepository } from 'src/db/repositories/directory.repository';
import { UserAlreadyExistsException } from 'src/features/users/exceptions/user-already-exists.exception';
import { UserNotFoundException } from 'src/features/users/exceptions/user-not-found.exception';

@Injectable()
export class UserService {
	constructor(
		private readonly directoryRepository: DirectoryRepository,
		private readonly userRepository: UserRepository
	) {}

	@Transactional()
	public async getUserByIdOrThrow(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ id });

		if (!user) {
			throw UserNotFoundException.fromId(id);
		}

		return user;
	}

	@Transactional()
	public async getUserByUsernameOrThrow(username: string): Promise<User> {
		const user = await this.userRepository.findOne({ username });

		if (!user) {
			throw UserNotFoundException.fromUsername(username);
		}

		return user;
	}

	@Transactional()
	public async createUserOrThrow(username: string, password: string): Promise<void> {
		const existingUser = await this.userRepository.findOne({ username });

		if (existingUser) {
			throw UserAlreadyExistsException.fromUsername(existingUser.username);
		}

		const cryptedPassword = await hash(password, 10);

		const user = this.userRepository.create({ username, password: cryptedPassword });

		this.directoryRepository.create({ parent: null, name: ROOT_ID, user: user });
	}
}
