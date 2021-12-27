import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: RegisterDto): Promise<any> {
    return await this.usersService.create(user);
  }

  async login(user: User): Promise<any> {
    const accessToken: string = this.getAccessToken(user.id);
    const refreshToken: string = this.getRefreshToken(user.id);

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: 'bearer',
      expires: this.configService.get<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    };
  }

  async logout(user: User): Promise<boolean> {
    return await this.usersService.deleteRefreshToken(user.id);
  }

  async refresh(user: User): Promise<any> {
    const accessToken: string = this.getAccessToken(user.id);

    return {
      accessToken: accessToken,
      tokenType: 'bearer',
      expires: this.configService.get<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    };
  }

  async findByCredentials(userName: string, password: string): Promise<User> {
    const user: User = await this.usersService.findByUserName(userName);
    await this.verifyPassword(password, user.password);

    return user;
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

  private getAccessToken(id: string): string {
    const payload: TokenPayload = { userId: id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  private getRefreshToken(id: string): string {
    const payload: TokenPayload = { userId: id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get<number>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
}
