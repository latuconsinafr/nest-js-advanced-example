import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
