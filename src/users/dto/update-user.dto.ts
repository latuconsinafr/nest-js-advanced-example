import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 16)
  userName: string;

  @IsEmail()
  email?: string;

  @IsPhoneNumber('ID')
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  refreshToken?: string;
}
