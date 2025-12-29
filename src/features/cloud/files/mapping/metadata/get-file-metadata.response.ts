/**-------------------------------------------------------------------------
 * Copyright (c) 2025 - Nicolas Stadler. All rights reserved.
 * Licensed under the MIT License. See the project root for more information.
 *
 * @author Nicolas Stadler
 *-------------------------------------------------------------------------*/
import { ApiProperty } from '@nestjs/swagger';
import { FileMetadata } from 'src/features/cloud/files/types/file-metadata';

export class GetFileMetadataResponse {
	@ApiProperty({ description: 'The id of the file', type: 'string', example: '133a8736-111a-4cf7-ae84-dbe040ad4382' })
	public readonly id: string;

	@ApiProperty({ description: 'The name of the file', type: 'string', example: 'file.txt' })
	public readonly name: string;

	@ApiProperty({ description: 'The mime type of the file', type: 'string', format: 'MimeType', example: 'text/plain' })
	public readonly mimeType: string;

	@ApiProperty({ description: 'The size of the file in bytes', type: 'number', example: 1182 })
	public readonly size: number;

	@ApiProperty({ description: 'The date the file was created', type: 'string', format: 'Date', example: '2024-05-05 17:37:33' })
	public readonly createdAt: Date;

	@ApiProperty({ description: 'The date the file was last modified', type: 'string', format: 'Date', example: '2024-05-05 17:37:33' })
	public readonly updatedAt: Date;

	@ApiProperty({ description: 'The id of the files directory', type: 'string', example: 'd9f1e2a3-aaaa-bbbb-cccc-445566778899' })
	public readonly parentId: string;

	@ApiProperty({ description: 'The id of the files user', type: 'string', example: 'c3b3e2a5-d94f-4a49-b826-112233445566' })
	public readonly userId: string;

	@ApiProperty({ description: 'The absolute path of the directory', type: 'string', example: '/home/user/photos' })
	public readonly path: string;

	@ApiProperty({
		description: 'The chain of ids',
		type: 'string',
		isArray: true,
		example: "['2c3f4a65-7d61-4532-b9ea-e1b5537f0bcf', '2c3f4a65-7d61-4532-b9ea-e1b5537f0bcf', '2c3f4a65-7d61-4532-b9ea-e1b5537f0bcf']"
	})
	public readonly idChain: Array<string>;

	private constructor(metadata: FileMetadata) {
		this.id = metadata.id;
		this.name = metadata.name;
		this.mimeType = metadata.mimeType;
		this.size = metadata.size;
		this.createdAt = metadata.createdAt;
		this.updatedAt = metadata.updatedAt;
		this.parentId = metadata.parentId;
		this.userId = metadata.userId;
		this.path = metadata.path;
		this.idChain = metadata.idChain;
	}

	public static fromMetadata(metadata: FileMetadata): GetFileMetadataResponse {
		return new GetFileMetadataResponse(metadata);
	}
}
