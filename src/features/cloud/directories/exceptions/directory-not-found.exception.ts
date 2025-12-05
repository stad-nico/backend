/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { NotFoundException } from '@nestjs/common';

export class DirectoryNotFoundException extends NotFoundException {
	private constructor(message: string) {
		super(message);
	}

	public static fromId(id: string): DirectoryNotFoundException {
		return new DirectoryNotFoundException(`directory with id ${id} not found`);
	}

	public static fromName(name: string): DirectoryNotFoundException {
		return new DirectoryNotFoundException(`directory with name ${name} not found`);
	}
}
