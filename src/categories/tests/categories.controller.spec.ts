import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoriesMockService } from './mocks/categories-mock.service';
import {
  categoriesStub,
  categoryStub1,
  categoryStubId1,
} from './stubs/categories.stub';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useClass: CategoriesMockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  test('it should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    describe('when getAllCategories is called', () => {
      let categories: Category[];

      beforeEach(async () => {
        jest.spyOn(service, 'findAll').mockResolvedValue(categoriesStub());
        categories = await controller.getAllCategories();
      });

      test('it should call categoriesService findAll method', () => {
        expect(service.findAll).toBeCalled();
      });
      test('it should return an array of categories', () => {
        expect(categories).toEqual(categoriesStub());
      });
    });
  });

  describe('getCategoryById', () => {
    describe('when getCategoryById is called with non-existing Id', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'findById')
          .mockRejectedValue(new NotFoundException());
      });

      test('it should throw a not found exception', async () => {
        await expect(
          controller.getCategoryById({ id: categoryStubId1() }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('when getCategoryById is called with existing Id', () => {
      let category: Category;

      beforeEach(async () => {
        jest.spyOn(service, 'findById').mockResolvedValue(categoryStub1());

        category = await controller.getCategoryById({
          id: categoryStubId1(),
        });
      });

      test('it should call categoriesService findById method', () => {
        expect(service.findById).toBeCalledWith(categoryStubId1());
      });

      test('it should return a category', () => {
        expect(category).toEqual(categoryStub1());
      });
    });
  });

  describe('createCategory', () => {
    describe('when createCategory is called', () => {
      let createdCategory: Category;
      let dto: CreateCategoryDto;
      const stub: Category = categoryStub1();

      beforeEach(async () => {
        dto = {
          name: 'New Category',
        };
        stub.name = dto.name;

        jest.spyOn(service, 'create').mockResolvedValue(stub);

        createdCategory = await controller.createCategory(dto);
      });

      test('it should call categoriesService create method', () => {
        expect(service.create).toBeCalledWith(dto);
      });
      test('it should return a created category', () => {
        expect(createdCategory).toEqual(stub);
      });
    });
  });

  describe('updateCategory', () => {
    describe('when updateCategory is called with non existing Id', () => {
      let dto: UpdateCategoryDto;

      beforeEach(async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new NotFoundException());

        dto = {
          id: categoryStubId1(),
          name: 'New Category',
        };
      });

      test('it should throws a not found exception', async () => {
        await expect(
          controller.updateCategory({ id: categoryStubId1() }, dto),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('when updateCategory is called with existing Id but conflicted', () => {
      let dto: UpdateCategoryDto;

      beforeEach(async () => {
        jest
          .spyOn(service, 'update')
          .mockRejectedValue(new ConflictException());

        dto = {
          id: categoryStubId1(),
          name: 'New Category',
        };
      });

      test('it should throws a conflict exception', async () => {
        await expect(
          controller.updateCategory({ id: categoryStubId1() }, dto),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('when updateCategory is called with existing Id and not conflicted', () => {
      let result: boolean;
      let dto: UpdateCategoryDto;

      beforeEach(async () => {
        jest.spyOn(service, 'update').mockResolvedValue(true);

        dto = {
          id: categoryStubId1(),
          name: 'New Category',
        };

        result = await controller.updateCategory(
          { id: categoryStubId1() },
          dto,
        );
      });

      test('it should call categoriesService update method', () => {
        expect(service.update).toBeCalledWith(categoryStubId1(), dto);
      });

      test('it should return a category', () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe('deleteCategory', () => {
    describe('when deleteCategory is called with non-existing Id', () => {
      beforeEach(() => {
        jest
          .spyOn(service, 'delete')
          .mockRejectedValue(new NotFoundException());
      });

      test('it should throw a not found exception', async () => {
        await expect(
          controller.deleteCategory({ id: categoryStubId1() }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('when getCategoryById is called with existing Id', () => {
      let result: boolean;

      beforeEach(async () => {
        jest.spyOn(service, 'delete').mockResolvedValue(true);

        result = await controller.deleteCategory({
          id: categoryStubId1(),
        });
      });

      test('it should call categoriesService delete method', () => {
        expect(service.delete).toBeCalledWith(categoryStubId1());
      });

      test('it should return a category', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
