import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { mockedConfigService } from 'src/utils/mocks/config.service';
import { mockedJwtService } from 'src/utils/mocks/jwt.service';
import { AuthService } from '../auth.service';

describe('The AuthService', () => {
  let authService: AuthService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
          },
        },
      ],
    }).compile();
    authService = await module.get(AuthService);
  });

  describe('when validate a user', () => {
    describe('and the username and password match', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return User object', async () => {
        const validatedUser = await authService.validateUser(
          'user',
          'password',
        );
        expect(validatedUser).toEqual(user);
      });
    });
    describe('and the username and password does not match', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        const validatedUser = await authService.validateUser(
          'user',
          'password',
        );

        expect(validatedUser).rejects.toThrow(NotFoundException);
      });
    });
  });
});
