import { IsString, MinLength, IsOptional } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;

  /** Required when user changes own password; admin can omit to set without current. */
  @IsOptional()
  @IsString()
  currentPassword?: string;
}
