import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { TodosModule } from './todos/todos.module';
import { Category } from './categories/category.entity';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url:
          process.env.DATABASE_URL ||
          process.env.POSTGRES_URL ||
          process.env.POSTGRES_PRISMA_URL,
        entities: [Category, Todo],
        ssl: { rejectUnauthorized: false },
        extra: { max: 3 },
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
    CategoriesModule,
    TodosModule,
  ],
})
export class AppModule {}
