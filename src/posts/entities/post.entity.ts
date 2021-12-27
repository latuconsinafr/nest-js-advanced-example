import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index('post_title_index')
  @Column()
  public title: string;

  @Column('text')
  public content: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];
}
