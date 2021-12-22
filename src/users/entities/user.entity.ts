import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
