/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { NotFoundException } from '@nestjs/common';

export class TodoNotFoundException extends NotFoundException {
	private constructor(message: string) {
		super(message);
	}

	public static fromId(id: string): TodoNotFoundException {
		return new TodoNotFoundException(`todo with id ${id} not found`);
	}
}
