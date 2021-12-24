import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoriesMockRepository } from './mocks/categories-mock.repository';
import {
  categoryStubId1,
  categoriesStub,
  categoryStub1,
  categoryStubId2,
} from './stubs/categories.stub';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: CategoriesMockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  test('it should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let categories: Category[];

      beforeEach(async () => {
        jest.spyOn(repository, 'find').mockResolvedValue(categoriesStub());
        categories = await service.findAll();
      });

      test('it should call categoriesRepository find method', () => {
        expect(repository.find).toBeCalled();
      });
      test('it should return an array of categories', () => {
        expect(categories).toEqual(categoriesStub());
      });
    });
  });

  describe('findById', () => {
    describe('when findById is called with non-existing Id', () => {
      let category: Category;
      let error: any;

      beforeEach(async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        try {
          category = await service.findById(categoryStubId1());
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should throws a not found exception', () => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(category).toBeUndefined();
      });
    });

    describe('when findById is called with existing Id', () => {
      let category: Category;
      let error: any;

      beforeEach(async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub1());

        try {
          category = await service.findById(categoryStubId1());
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should return a category', () => {
        expect(error).toBeUndefined();
        expect(category).toEqual(categoryStub1());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let createdCategory: Category;
      let dto: CreateCategoryDto;

      beforeEach(async () => {
        dto = {
          name: 'New Category',
        };

        jest.spyOn(repository, 'create').mockReturnValue(categoryStub1());
        jest.spyOn(repository, 'save').mockResolvedValue(categoryStub1());

        createdCategory = await service.create(dto);
      });

      test('it should call categoriesRepository create method', () => {
        expect(repository.create).toBeCalledWith(dto);
      });
      test('it should call categoriesRepository save method', () => {
        expect(repository.save).toBeCalledWith(categoryStub1());
      });
      test('it should return a category', () => {
        expect(createdCategory).toEqual(categoryStub1());
      });
    });
  });

  describe('update', () => {
    describe('when update is called with non existing Id', () => {
      let result: boolean;
      let dto: UpdateCategoryDto;
      let error: any;

      beforeEach(async () => {
        dto = {
          id: categoryStubId1(),
          name: 'New Category',
        };

        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        try {
          result = await service.update(categoryStubId1(), dto);
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should throws a not found exception', () => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(result).toBeUndefined();
      });
    });

    describe('when update is called with existing Id but conflicted', () => {
      let result: boolean;
      let dto: UpdateCategoryDto;
      let error: any;

      beforeEach(async () => {
        dto = {
          id: categoryStubId2(),
          name: 'New Category',
        };

        jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub1());

        try {
          result = await service.update(categoryStubId1(), dto);
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should throws a conflict exception', () => {
        expect(error).toBeInstanceOf(ConflictException);
        expect(result).toBeUndefined();
      });
    });

    describe('when update is called with existing Id and not conflicted but nothing updated', () => {
      let result: boolean;
      let dto: UpdateCategoryDto;
      let error: any;

      beforeEach(async () => {
        dto = {
          id: categoryStubId1(),
          name: categoryStub1().name,
        };

        jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub1());
        jest.spyOn(repository, 'update').mockResolvedValue({
          affected: 0,
          raw: categoryStub1(),
          generatedMaps: undefined,
        });

        try {
          result = await service.update(categoryStubId1(), dto);
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should call categoriesRepository update method', () => {
        expect(repository.update).toBeCalledWith(categoryStubId1(), dto);
      });
      test('it should return false', () => {
        expect(error).toBeUndefined();
        expect(result).toBeFalsy();
      });
    });

    describe('when update is called with existing Id and not conflicted and also being updated', () => {
      let result: boolean;
      let dto: UpdateCategoryDto;
      let error: any;

      beforeEach(async () => {
        dto = {
          id: categoryStubId1(),
          name: 'New Category',
        };

        jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub1());
        jest.spyOn(repository, 'update').mockResolvedValue({
          affected: 1,
          raw: categoryStub1(),
          generatedMaps: undefined,
        });

        try {
          result = await service.update(categoryStubId1(), dto);
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should call categoriesRepository update method', () => {
        expect(repository.update).toBeCalledWith(categoryStubId1(), dto);
      });
      test('it should return true', () => {
        expect(error).toBeUndefined();
        expect(result).toBeTruthy();
      });
    });
  });

  describe('delete', () => {
    describe('when delete is called with non-existing Id', () => {
      let result: boolean;
      let error: any;

      beforeEach(async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        try {
          result = await service.delete(categoryStubId1());
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should throws a not found exception', () => {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(result).toBeUndefined();
      });
    });

    describe('when delete is called with existing Id', () => {
      let result: boolean;
      let error: any;

      beforeEach(async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(categoryStub1());
        jest
          .spyOn(repository, 'delete')
          .mockResolvedValue({ affected: 1, raw: undefined });

        try {
          result = await service.delete(categoryStubId1());
        } catch (e) {
          error = e;
        }
      });

      test('it should call categoriesRepository findOne method', () => {
        expect(repository.findOne).toBeCalledWith(categoryStubId1());
      });
      test('it should call categoriesRepository delete method', () => {
        expect(repository.delete).toBeCalledWith(categoryStubId1());
      });
      test('it should return true', () => {
        expect(error).toBeUndefined();
        expect(result).toBeTruthy();
      });
    });
  });
});
