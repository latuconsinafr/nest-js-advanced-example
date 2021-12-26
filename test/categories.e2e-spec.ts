import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../src/categories/categories.service';
import { categoriesStub } from '../src/categories/tests/stubs/categories.stub';
import { AppModule } from '../src/app.module';

describe('Categories', () => {
  let app: INestApplication;
  const categoriesService = {
    findAll: () => categoriesStub(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/GET categories', () => {
    return request(app.getHttpServer()).get('/categories').expect(401);
  });
});
