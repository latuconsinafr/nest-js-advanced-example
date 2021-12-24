import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostConflictException } from './exceptions/post-conflict.exception';
import { PostNotFoundException } from './exceptions/post-not-found.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: ['author', 'categories'],
    });
  }

  async findById(id: string): Promise<Post> {
    const post: Post | undefined = await this.postsRepository.findOne(id, {
      relations: ['author', 'categories'],
    });

    if (post === undefined) {
      throw new PostNotFoundException(id);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    return await this.postsRepository.save(
      this.postsRepository.create({
        ...createPostDto,
        author: user,
        categories: await this.categoriesRepository.findByIds(
          createPostDto.categoryIds,
        ),
      }),
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    const postToUpdate: Post | undefined = await this.postsRepository.findOne(
      id,
    );

    if (postToUpdate === undefined) {
      throw new PostNotFoundException(id);
    }
    if (postToUpdate.id !== updatePostDto.id) {
      throw new PostConflictException(id);
    }

    await this.postsRepository.update(id, updatePostDto);

    return true;
  }

  async delete(id: string): Promise<boolean> {
    const postToDelete: Post | undefined = await this.postsRepository.findOne(
      id,
    );

    if (postToDelete === undefined) {
      throw new PostNotFoundException(id);
    }

    await this.postsRepository.delete(id);

    return true;
  }
}
