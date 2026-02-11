import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateTodoBody {
	@ApiProperty({ example: 'Buy groceries', description: 'The title of the todo', type: 'string' })
	public readonly title!: string;

	@ApiProperty({ example: 'Buy groceries', description: 'The description of the todo', type: 'string', required: false })
	public readonly description!: string | null;

	@ApiProperty({
		example: '2024-05-10 12:00:00',
		description: 'The due date of the todo',
		type: 'string',
		format: 'Date',
		required: false
	})
	public readonly dueBy!: Date | null;
}
