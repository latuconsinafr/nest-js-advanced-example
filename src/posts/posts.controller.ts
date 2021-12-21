import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  async getPostById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.postsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    await this.postsService.create(post);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() post: UpdatePostDto,
  ) {
    await this.postsService.update(id, post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.delete(id);
  }
}
