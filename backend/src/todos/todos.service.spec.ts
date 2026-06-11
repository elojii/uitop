import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { CategoriesService } from '../categories/categories.service';
import { Todo } from './todo.entity';
import { Category } from '../categories/category.entity';

describe('TodosService', () => {
  let module: TestingModule;
  let todosService: TodosService;
  let categoriesService: CategoriesService;
  let categoryIds: number[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [Todo, Category],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Todo, Category]),
      ],
      providers: [TodosService, CategoriesService],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    categoriesService = module.get<CategoriesService>(CategoriesService);

    await categoriesService.onModuleInit();
    const cats = await categoriesService.findAll();
    categoryIds = cats.map((c) => c.id);
  });

  afterAll(async () => {
    await module.close();
  });

  it('creates a todo successfully', async () => {
    const todo = await todosService.create({ text: 'Buy milk', categoryId: categoryIds[0] });
    expect(todo.id).toBeDefined();
    expect(todo.text).toBe('Buy milk');
    expect(todo.completed).toBe(false);
    expect(todo.category.id).toBe(categoryIds[0]);
  });

  it('returns 400 when a category already has 5 todos', async () => {
    const catId = categoryIds[1];
    for (let i = 0; i < 5; i++) {
      await todosService.create({ text: `Task ${i}`, categoryId: catId });
    }
    await expect(
      todosService.create({ text: 'Overflow', categoryId: catId }),
    ).rejects.toThrow('Category already has the maximum of 5 tasks');
  });

  it('marks a todo as completed', async () => {
    const todo = await todosService.create({ text: 'To complete', categoryId: categoryIds[2] });
    const updated = await todosService.update(todo.id, { completed: true });
    expect(updated.completed).toBe(true);
  });

  it('filters todos by category', async () => {
    const catId = categoryIds[3];
    await todosService.create({ text: 'Filtered task', categoryId: catId });
    const results = await todosService.findAll(catId);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => t.category.id === catId)).toBe(true);
  });

  it('deletes a todo', async () => {
    const catId = categoryIds[4];
    const todo = await todosService.create({ text: 'To delete', categoryId: catId });
    await todosService.remove(todo.id);
    const results = await todosService.findAll(catId);
    expect(results.find((t) => t.id === todo.id)).toBeUndefined();
  });

  it('restores a soft-deleted todo', async () => {
    const catId = categoryIds[0];
    const todo = await todosService.create({ text: 'To restore', categoryId: catId });
    await todosService.remove(todo.id);
    const restored = await todosService.restore(todo.id);
    expect(restored.id).toBe(todo.id);
    expect(restored.text).toBe('To restore');
    const results = await todosService.findAll(catId);
    expect(results.find((t) => t.id === todo.id)).toBeDefined();
  });
});
