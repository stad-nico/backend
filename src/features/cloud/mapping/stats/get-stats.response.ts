import { ApiProperty } from '@nestjs/swagger';

export class GetStatsResponse {
	@ApiProperty({ description: 'The amount of files this directory and each subdirectory contains in total', type: 'number', example: 42 })
	public readonly files: number;

	@ApiProperty({
		description: 'The amount of directories this directory and each subdirectory contains in total',
		type: 'number',
		example: 9
	})
	public readonly directories: number;

	private constructor(files: number, directories: number) {
		this.files = files;
		this.directories = directories;
	}

	public static from(files: number, directories: number): GetStatsResponse {
		return new GetStatsResponse(files, directories);
	}
}
