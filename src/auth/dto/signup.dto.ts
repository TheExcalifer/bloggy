import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LoginDto } from './login.dto';
import { PickType } from '@nestjs/mapped-types';
import { UserRole } from '../../users/enum/user.enum';
import { Transform, TransformFnParams } from 'class-transformer';
export class SignupDto extends PickType(LoginDto, [
  'username',
  'password',
] as const) {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
