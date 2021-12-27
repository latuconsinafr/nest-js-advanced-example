import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index('user_user_name_index')
  @Column({ unique: true })
  public userName: string;

  @Index('user_email_index')
  @Column({ unique: true, nullable: true })
  public email?: string;

  @Index('user_phone_number_index')
  @Column({ unique: true, nullable: true })
  public phoneNumber?: string;

  @Exclude()
  @Column()
  public password: string;

  @Exclude()
  @Column({ nullable: true })
  public refreshToken?: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}
