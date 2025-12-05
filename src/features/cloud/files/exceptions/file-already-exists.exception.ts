/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ConflictException } from '@nestjs/common';

export class FileAlreadyExistsException extends ConflictException {
	private constructor(message: string) {
		super(message);
	}

	public static fromName(name: string): FileAlreadyExistsException {
		return new FileAlreadyExistsException(`file with name ${name} already exists`);
	}
}
