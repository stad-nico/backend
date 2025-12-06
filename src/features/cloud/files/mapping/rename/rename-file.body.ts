/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { VALID_FILE_NAME_REGEXP } from 'src/features/cloud/files/utils/constants';

export class RenameFileBody {
	@Matches(VALID_FILE_NAME_REGEXP)
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'renamed.txt',
		description: 'The name to rename the file to',
		pattern: `${VALID_FILE_NAME_REGEXP}`,
	})
	readonly name!: string;
}
