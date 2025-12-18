/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { VALID_DIRECTORY_NAME_REGEXP } from 'src/features/cloud/files/utils/constants';

export class CreateDirectoryBody {
	@Matches(VALID_DIRECTORY_NAME_REGEXP)
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'photos',
		description: 'The name of the new directory',
		pattern: `${VALID_DIRECTORY_NAME_REGEXP}`
	})
	public readonly name!: string;
}
