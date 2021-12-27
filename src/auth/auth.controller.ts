import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return await this.authService.register(user);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: RequestWithUser) {
    return await this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticate(@Request() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Request() request: RequestWithUser) {
    return await this.authService.refresh(request.user);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() request: RequestWithUser) {
    return await this.authService.logout(request.user);
  }
}
