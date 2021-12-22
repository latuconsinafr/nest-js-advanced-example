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

  async create(user: CreateUserDto): Promise<void> {
    await this.usersRepository.save(
      this.usersRepository.create({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }),
    );
  }

  async update(id: string, user: UpdateUserDto): Promise<void> {
    const userToUpdate: User | undefined = await this.usersRepository.findOne(
      id,
    );

    if (userToUpdate === undefined) {
      throw new NotFoundException();
    }
    if (userToUpdate.id !== id) {
      throw new ConflictException();
    }

    await this.usersRepository.update(id, user);
  }

  async delete(id: string): Promise<void> {
    const userToDelete: User | undefined = await this.usersRepository.findOne(
      id,
    );

    if (userToDelete === undefined) {
      throw new NotFoundException();
    }

    await this.usersRepository.delete(id);
  }
}
