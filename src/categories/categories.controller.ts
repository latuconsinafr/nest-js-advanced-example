import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IdParams } from 'src/utils/validators/id.params.validator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCategories() {
    return await this.categoriesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCategoryById(@Param() { id }: IdParams) {
    return await this.categoriesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() category: CreateCategoryDto) {
    await this.categoriesService.create(category);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCategory(
    @Param() { id }: IdParams,
    @Body() category: UpdateCategoryDto,
  ) {
    await this.categoriesService.update(id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param() { id }: IdParams) {
    await this.categoriesService.delete(id);
  }
}
