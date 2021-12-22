import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}
