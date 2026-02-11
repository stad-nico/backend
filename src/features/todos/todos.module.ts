import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Todo } from 'src/db/entities/todo.entity';
import { TodoController } from './todos.controller';
import { TodoService } from './todos.service';

@Module({
	imports: [MikroOrmModule.forFeature([Todo])],
	controllers: [TodoController],
	providers: [TodoService]
})
export class TodoModule {}
