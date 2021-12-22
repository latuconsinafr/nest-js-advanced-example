import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParams {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}
