import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne(id);

    if (user === undefined) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByIdAndRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.findById(id);

    if (typeof user.refreshToken === undefined || !user.refreshToken) {
      throw new NotFoundException();
    }

    const isTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isTokenMatching) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUserName(userName: string): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne({
      userName,
    });

    if (user === undefined) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmailOrPhoneNumber(emailOrPhoneNumber: string): Promise<User> {
    const user: User | undefined = await this.usersRepository.findOne({
      where: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    });

    if (user === undefined) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(
      this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const userToUpdate: User | undefined = await this.usersRepository.findOne(
      id,
    );

    if (userToUpdate === undefined) {
      throw new NotFoundException();
    }
    if (userToUpdate.id !== updateUserDto.id) {
      throw new ConflictException();
    }

    await this.usersRepository.update(id, updateUserDto);

    return true;
  }

  async setRefreshToken(id: string, token: string): Promise<boolean> {
    const refreshToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(id, {
      refreshToken,
    });

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const userToDelete: User | undefined = await this.usersRepository.findOne(
      id,
    );

    if (userToDelete === undefined) {
      throw new NotFoundException();
    }

    await this.usersRepository.delete(id);

    return true;
  }

  async deleteRefreshToken(id: string): Promise<boolean> {
    await this.usersRepository.update(id, {
      refreshToken: null,
    });

    return true;
  }
}
