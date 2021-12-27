import { Post } from '../../posts/entities/post.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('category_name_index')
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[];
}
