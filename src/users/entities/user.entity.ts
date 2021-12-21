import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public userName: string;

  @Column({ unique: true })
  public email?: string;

  @Column({ unique: true })
  public phoneNumber?: string;

  @Column()
  public password: string;
}
