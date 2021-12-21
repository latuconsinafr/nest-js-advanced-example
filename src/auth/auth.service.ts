import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(user: RegisterDto): Promise<any> {
    await this.usersService.create({
      ...user,
      // password: await bcrypt.hash(user.password, 10),
      password: user.password,
    });

    const { password, ...result }: User | undefined =
      await this.usersService.findByUserName(user.userName);

    return result;
  }

  async getAuthenticatedUser(userName: string, password: string): Promise<any> {
    const user: User | undefined = await this.usersService.findByUserName(
      userName,
    );
    const isPasswordMatching: boolean = await this.verifyPassword(
      password,
      user.password,
    );

    if (user && isPasswordMatching) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.usersService.findByUserName(userName);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign({
        userName: user.userName,
        sub: user.Id,
      }),
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
