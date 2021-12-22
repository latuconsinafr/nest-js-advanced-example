import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;
}
