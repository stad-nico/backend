/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ArgumentMetadata, PipeTransform, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class TestValidationPipe extends ValidationPipe implements PipeTransform {
	private static disabled = false;

	constructor(options?: ValidationPipeOptions | undefined) {
		super(options);
	}

	public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
		if (TestValidationPipe.disabled) {
			return value;
		}

		return super.transform(value, metadata);
	}

	public static disable(): void {
		TestValidationPipe.disabled = true;
	}

	public static enable(): void {
		TestValidationPipe.disabled = false;
	}
}
