/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
	private constructor(message: string) {
		super(message);
	}

	public static fromId(id: string): UserNotFoundException {
		return new UserNotFoundException(`user with id ${id} does not exist`);
	}

	public static fromUsername(username: string): UserNotFoundException {
		return new UserNotFoundException(`user with username ${username} does not exist`);
	}
}
