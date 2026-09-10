import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class RegistrationAuthDto{
    @IsString()
    @IsNotEmpty()
    firstName!: string;
    @IsString()
    @IsNotEmpty()
    lastName!: string;
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    @IsString()
    @IsNotEmpty()
    phone!: string;
    @IsString()
    @IsNotEmpty()
    address!: string;
    @IsString()
    @IsNotEmpty()
    city!: string;
    @IsString()
    @IsNotEmpty()
    password!: string;
   @IsString()
   @IsOptional()
  profileImage?: string;
}
