/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { InternalServerErrorException } from '@nestjs/common';

export class SomethingWentWrongException extends InternalServerErrorException {
	constructor() {
		super(`something went wrong`);
	}
}
