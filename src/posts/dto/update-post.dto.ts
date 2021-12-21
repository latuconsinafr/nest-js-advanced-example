import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
