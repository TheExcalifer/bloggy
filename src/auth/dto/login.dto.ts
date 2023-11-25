import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(5)
  @MaxLength(64)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}
