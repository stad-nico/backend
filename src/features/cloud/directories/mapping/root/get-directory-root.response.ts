/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';

export class GetDirectoryRootResponse {
	@ApiProperty({
		example: '133a8736-111a-4cf7-ae84-dbe040ad4382',
		description: 'The id of the root'
	})
	public readonly id: string;

	private constructor(id: string) {
		this.id = id;
	}

	public static fromId(id: string): GetDirectoryRootResponse {
		return new GetDirectoryRootResponse(id);
	}
}
