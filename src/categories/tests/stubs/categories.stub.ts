import { Category } from 'src/categories/entities/category.entity';

export const categoryStubId1 = (): string => {
  return 'fff7ca0c-1fb8-4750-96fa-a3bc73a49566';
};

export const categoryStubId2 = (): string => {
  return 'dc14a9cd-be01-4cd9-a21f-987093b8da1c';
};

export const categoriesStub = (): Category[] => {
  return [
    {
      id: categoryStubId1(),
      name: 'Science',
      posts: [],
    },
    {
      id: categoryStubId2(),
      name: 'Mental Health',
      posts: [],
    },
    {
      id: '87755f4f-a673-4de6-9f25-2d13946833d5',
      name: 'Love',
      posts: [],
    },
  ];
};

export const categoryStub1 = (): Category => {
  return categoriesStub().find(({ id }) => id === categoryStubId1());
};

export const categoryStub2 = (): Category => {
  return categoriesStub().find(({ id }) => id === categoryStubId2());
};
