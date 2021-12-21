import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
