import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.interface';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  findAll(): Post[] {
    return this.posts;
  }

  findById(id: number): Post {
    const post: Post | undefined = this.posts.find((post) => post.id === id);

    if (post === undefined) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  create(post: CreatePostDto): void {
    const newPost = {
      id: ++this.lastPostId,
      ...post,
    };

    this.posts.push(newPost);
  }

  update(id: number, post: UpdatePostDto): void {
    const postToUpdateIndex: number | undefined = this.posts.findIndex(
      (post) => post.id === id,
    );

    if (postToUpdateIndex < 0 || postToUpdateIndex === undefined) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    if (this.posts[postToUpdateIndex].id !== id) {
      throw new HttpException('Post id does not match', HttpStatus.CONFLICT);
    }

    this.posts[postToUpdateIndex] = post;
  }

  delete(id: number): void {
    const postToDeleteIndex: number | undefined = this.posts.findIndex(
      (post) => post.id === id,
    );

    if (postToDeleteIndex < 0 || postToDeleteIndex === undefined) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    this.posts.splice(postToDeleteIndex, 1);
  }
}
