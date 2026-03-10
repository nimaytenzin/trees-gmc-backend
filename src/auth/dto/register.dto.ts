import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
