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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesRepository.save(
      this.categoriesRepository.create(createCategoryDto),
    );
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<boolean> {
    const categoryToUpdate: Category | undefined =
      await this.categoriesRepository.findOne(id);

    if (categoryToUpdate === undefined) {
      throw new NotFoundException();
    }
    if (categoryToUpdate.id !== updateCategoryDto.id) {
      throw new ConflictException();
    }

    const result = await this.categoriesRepository.update(
      id,
      updateCategoryDto,
    );

    return result.affected > 0;
  }

  async delete(id: string): Promise<boolean> {
    const categoryToDelete: Category | undefined =
      await this.categoriesRepository.findOne(id);

    if (categoryToDelete === undefined) {
      throw new NotFoundException();
    }

    const result = await this.categoriesRepository.delete(id);

    return result.affected > 0;
  }
}
