import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { MEMBERSHIP_TYPE } from '../enums/membership.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(MEMBERSHIP_TYPE)
  membershipType: MEMBERSHIP_TYPE;
}
