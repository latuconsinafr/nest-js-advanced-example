import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { IdParams } from 'src/utils/validators/id.params.validator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosts() {
    return await this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPostById(@Param() { id }: IdParams) {
    return await this.postsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() post: CreatePostDto,
    @Req() request: RequestWithUser,
  ) {
    return await this.postsService.create(post, request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(@Param() { id }: IdParams, @Body() post: UpdatePostDto) {
    return await this.postsService.update(id, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param() { id }: IdParams) {
    return await this.postsService.delete(id);
  }
}
