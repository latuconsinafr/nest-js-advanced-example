import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public userName: string;

  @Column({ unique: true, nullable: true })
  public email?: string;

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
