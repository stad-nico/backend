/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginBody {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: 'mustermannsmax', description: 'The name of the user' })
	public readonly username!: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ example: '23q48xfm345v987251um8235vz78924tr5z', description: 'The encrypted password of the user' })
	public readonly password!: string;
}
