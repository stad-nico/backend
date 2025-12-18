/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { BadRequestException } from '@nestjs/common';
import { MAX_DIRECTORY_NAME_LENGTH } from 'src/features/cloud/files/utils/constants';

export class DirectoryNameTooLongException extends BadRequestException {
	constructor(name: string) {
		super(`${name} exceeds the directory name limit of ${MAX_DIRECTORY_NAME_LENGTH} chars`);
	}
}
