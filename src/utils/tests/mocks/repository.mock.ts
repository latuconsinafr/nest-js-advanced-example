import { Repository } from 'typeorm';
import { MockType } from './mock.type';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest
  .fn()
  .mockReturnValue({
    find: jest.fn().mockImplementation((entities: any[]) => entities),
    findOne: jest.fn().mockResolvedValue((entity: any) => entity),
    create: jest.fn().mockResolvedValue((dto: any) => Promise.resolve()),
    save: jest.fn().mockImplementation((entity: any) => Promise.resolve()),
    update: jest
      .fn()
      .mockResolvedValue((id: string, dto: any) => Promise.resolve()),
    delete: jest.fn().mockResolvedValue((id: string) => Promise.resolve()),
  });
