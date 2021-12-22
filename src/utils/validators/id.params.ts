import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParams {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
