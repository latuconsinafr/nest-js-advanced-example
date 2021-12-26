import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: RegisterDto): Promise<any> {
    return await this.usersService.create(user);
  }

  async validateUser(userName: string, password: string): Promise<any> {
    const user: User = await this.usersService.findByUserName(userName);
    const isPasswordMatching: boolean = await this.verifyPassword(
      password,
      user.password,
    );

    if (user && isPasswordMatching) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload: TokenPayload = { userId: user.id };
    const token: string = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: user,
    };
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching: boolean = await bcrypt.compare(
      password,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credential provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }
}
