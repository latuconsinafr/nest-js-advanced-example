import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.findById(Number(id));
  }

  @Post()
  createPost(@Body() post: CreatePostDto) {
    this.postsService.create(post);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    this.postsService.update(Number(id), post);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    this.postsService.delete(Number(id));
  }
}
