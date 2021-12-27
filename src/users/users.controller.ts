import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IdParams } from '../utils/params/id.params';
import { PaginationParams } from '../utils/params/pagination.params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(
    // @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    return await this.usersService.findAll(offset, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param() { id }: IdParams) {
    return await this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param() { id }: IdParams, @Body() user: UpdateUserDto) {
    return await this.usersService.update(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param() { id }: IdParams) {
    return await this.usersService.delete(id);
  }
}
