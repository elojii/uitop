import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Study'];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryRepo.count();
    if (count === 0) {
      await this.categoryRepo.save(
        DEFAULT_CATEGORIES.map((name) => this.categoryRepo.create({ name })),
      );
    }
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoryRepo.findOneBy({ id });
  }
}
