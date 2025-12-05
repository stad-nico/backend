/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ConflictException } from '@nestjs/common';

export class DirectoryAlreadyExistsException extends ConflictException {
	private constructor(message: string) {
		super(message);
	}

	public static fromName(name: string): DirectoryAlreadyExistsException {
		return new DirectoryAlreadyExistsException(`directory with name ${name} already exists`);
	}
}
