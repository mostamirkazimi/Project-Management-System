import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  subject!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(1000)
  message!: string;
}