import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { TodosModule } from './todos/todos.module';
import { Category } from './categories/category.entity';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH || './data/db.sqlite',
      entities: [Category, Todo],
      synchronize: true,
    }),
    CategoriesModule,
    TodosModule,
  ],
})
export class AppModule {}
