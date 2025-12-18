/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshBody {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		example: 'invfqcd8z4rtvn26738rfmgvjjioh423tb3hbjogfdwbs1',
		description: 'The refresh token used to generate a new access token'
	})
	public readonly refreshToken!: string;
}
