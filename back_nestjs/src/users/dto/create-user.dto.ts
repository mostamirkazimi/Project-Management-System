import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @Matches(/^[A-Za-z\u0600-\u06FF\s]+$/, {
    message: 'First name can only contain letters',
  })
  firstName!: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @Matches(/^[A-Za-z\u0600-\u06FF\s]+$/, {
    message: 'Last name can only contain letters',
  })
  lastName!: string;


  @IsEmail()
  @IsNotEmpty()
  email!: string;


  @IsString()
  @IsNotEmpty()
  @Matches(/^07\d{8}$/, {
    message: 'Phone number must be a valid Afghan phone number',
  })
  phone!: string;


  @IsString()
  @IsOptional()
  address?: string;


  @IsString()
  @IsNotEmpty()
  city!: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password!: string;


  // Profile Image
  @IsString()
  @IsOptional()
  profileImage?: string;
}