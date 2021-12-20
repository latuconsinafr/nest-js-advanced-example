import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import PostsService from './posts.service';

@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async getPostById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.postsService.findById(id);
  }

  @Post()
  async createPost(@Body() post: CreatePostDto) {
    await this.postsService.create(post);
  }

  @Put(':id')
  async updatePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() post: UpdatePostDto,
  ) {
    await this.postsService.update(id, post);
  }

  @Delete(':id')
  async deletePost(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.delete(id);
  }
}
