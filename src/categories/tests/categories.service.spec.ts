import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from 'src/utils/tests/mocks/mock.type';
import { repositoryMockFactory } from 'src/utils/tests/mocks/repository.mock';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { categoriesStub } from './stubs/categories.stub';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: MockType<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let categories: Category[];

      beforeEach(async () => {
        categoriesRepository.find.mockReturnValue([categoriesStub()]);
        categories = await categoriesService.findAll();
      });

      test('then it should call categoriesRepository', () => {
        expect(categoriesRepository.find).toHaveBeenCalled();
      });

      test('then it should return categories', () => {
        expect(categories).toEqual([categoriesStub()]);
      });
    });
  });

  describe('findById', () => {
    describe('when findById is called', () => {
      let category: Category;

      beforeEach(async () => {
        categoriesRepository.findOne.mockReturnValue(categoriesStub());
        category = await categoriesService.findById(categoriesStub().id);
      });

      test('then it should call categoriesRepository', () => {
        expect(categoriesRepository.findOne).toBeCalledWith(
          categoriesStub().id,
        );
      });

      test('then it should return a category', () => {
        expect(category).toEqual(categoriesStub());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let createCategoryDto: CreateCategoryDto;

      beforeEach(async () => {
        createCategoryDto = {
          name: categoriesStub().name,
        };

        categoriesRepository.create.mockReturnValue(() => Promise.resolve());
        await categoriesService.create(createCategoryDto);
      });

      test('then it should call categoriesRepository', () => {
        expect(categoriesRepository.create).toBeCalledWith(createCategoryDto);
      });

      test('then it should return a void promise', async () => {
        await expect(
          categoriesService.create(createCategoryDto),
        ).resolves.not.toThrow();
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let updateCategoryDto: UpdateCategoryDto;

      beforeEach(async () => {
        updateCategoryDto = {
          id: categoriesStub().id,
          name: categoriesStub().name,
        };

        categoriesRepository.update.mockReturnValue(() => Promise.resolve());
        await categoriesService.update(categoriesStub().id, updateCategoryDto);
      });

      test('then it should call categoriesRepository', () => {
        expect(categoriesRepository.update).toBeCalledWith(
          categoriesStub().id,
          updateCategoryDto,
        );
      });

      test('then it should return a void promise', async () => {
        await expect(
          categoriesService.update(categoriesStub().id, updateCategoryDto),
        ).resolves.not.toThrow();
      });
    });
  });

  describe('delete', () => {
    describe('when delete is called', () => {
      beforeEach(async () => {
        categoriesRepository.delete.mockReturnValue(() => Promise.resolve());
        await categoriesService.delete(categoriesStub().id);
      });

      test('then it should call categoriesRepository', () => {
        expect(categoriesRepository.delete).toBeCalledWith(categoriesStub().id);
      });

      test('then it should return a void promise', async () => {
        await expect(
          categoriesService.delete(categoriesStub().id),
        ).resolves.not.toThrow();
      });
    });
  });
});
