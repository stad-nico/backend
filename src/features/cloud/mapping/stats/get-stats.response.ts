import { ApiProperty } from '@nestjs/swagger';

export class UploadedFile {
	@ApiProperty({ description: 'The id of the directory', type: 'string', example: '2c3f4a65-7d61-4532-b9ea-e1b5537f0bcf' })
	public readonly directoryId!: string;

	@ApiProperty({ description: 'The id of the file', type: 'string', example: '133a8736-111a-4cf7-ae84-dbe040ad4382' })
	public readonly id!: string;

	@ApiProperty({ description: 'The name of the file', type: 'string', example: 'file.txt' })
	public readonly name!: string;

	@ApiProperty({ description: 'The size of the file in bytes', type: 'number', example: 1182 })
	public readonly mimeType!: string;

	@ApiProperty({ description: 'The date the file was created', type: 'string', format: 'Date', example: '2024-05-05 17:37:33' })
	public readonly createdAt!: Date;
}

export class GetStatsResponse {
	@ApiProperty({ description: 'The amount of files this directory and each subdirectory contains in total', type: 'number', example: 42 })
	public readonly files: number;

	@ApiProperty({
		description: 'The amount of directories this directory and each subdirectory contains in total',
		type: 'number',
		example: 9
	})
	public readonly directories: number;

	public readonly lastUploadedFiles: Array<UploadedFile>;

	private constructor(files: number, directories: number, lastUploadedFiles: Array<UploadedFile>) {
		this.files = files;
		this.directories = directories;
		this.lastUploadedFiles = lastUploadedFiles;
	}

	public static from(files: number, directories: number, lastUploadedFiles: Array<UploadedFile>): GetStatsResponse {
		return new GetStatsResponse(files, directories, lastUploadedFiles);
	}
}
