/**-------------------------------------------------------------------------
 * Copyright (c) 2026 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoResponse {
	@ApiProperty({ example: '133a8736-111a-4cf7-ae84-dbe040ad4382', description: 'The id of the created todo' })
	public readonly id: string;

	private constructor(id: string) {
		this.id = id;
	}

	public static fromId(id: string): CreateTodoResponse {
		return new CreateTodoResponse(id);
	}
}
