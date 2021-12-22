import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findById(id: string): Promise<Category> {
    const category: Category | undefined =
      await this.categoriesRepository.findOne(id);

    if (category === undefined) {
      throw new NotFoundException();
    }

    return category;
  }

  async create(category: CreateCategoryDto): Promise<void> {
    await this.categoriesRepository.save(
      this.categoriesRepository.create(category),
    );
  }

  async update(id: string, category: UpdateCategoryDto): Promise<void> {
    const categoryToUpdate: Category | undefined =
      await this.categoriesRepository.findOne(id);

    if (categoryToUpdate === undefined) {
      throw new NotFoundException();
    }
    if (categoryToUpdate.id !== id) {
      throw new ConflictException();
    }

    await this.categoriesRepository.update(id, category);
  }

  async delete(id: string): Promise<void> {
    const categoryToDelete: Category | undefined =
      await this.categoriesRepository.findOne(id);

    if (categoryToDelete === undefined) {
      throw new NotFoundException();
    }

    await this.categoriesRepository.delete(id);
  }
}
