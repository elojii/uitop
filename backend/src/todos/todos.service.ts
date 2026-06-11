import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CategoriesService } from '../categories/categories.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { BulkCompleteDto } from './dto/bulk-complete.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(dto: CreateTodoDto): Promise<Todo> {
    const category = await this.categoriesService.findOne(dto.categoryId);
    if (!category) {
      throw new BadRequestException(`Category with id ${dto.categoryId} not found`);
    }

    const count = await this.todoRepo.count({ where: { category: { id: category.id } } });
    if (count >= 5) {
      throw new BadRequestException('Category already has the maximum of 5 tasks');
    }

    const todo = this.todoRepo.create({ text: dto.text, category, completed: false });
    return this.todoRepo.save(todo);
  }

  findAll(categoryId?: number): Promise<Todo[]> {
    if (categoryId) {
      return this.todoRepo.find({
        where: { category: { id: categoryId } },
        order: { createdAt: 'DESC' },
      });
    }
    return this.todoRepo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    todo.completed = dto.completed;
    return this.todoRepo.save(todo);
  }

  async bulkComplete(dto: BulkCompleteDto): Promise<Todo[]> {
    const todos = await this.todoRepo.findBy({ id: In(dto.ids) });
    todos.forEach((t) => (t.completed = true));
    return this.todoRepo.save(todos);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    await this.todoRepo.softDelete(id);
  }

  async restore(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findOne({ where: { id }, withDeleted: true });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    if (!todo.deletedAt) {
      return todo;
    }

    const count = await this.todoRepo.count({ where: { category: { id: todo.category.id } } });
    if (count >= 5) {
      throw new BadRequestException('Category already has the maximum of 5 tasks');
    }

    await this.todoRepo.restore(id);
    return this.todoRepo.findOneByOrFail({ id });
  }
}
