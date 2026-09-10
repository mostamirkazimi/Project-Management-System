import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
//import { JwtStrategy } from './strategy/jwt.strategy';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtStrategy } from './strategy/jwt-strategy';
import { Otp } from './entities/otp.entity';
import { MailModule } from 'src/mail/mail.module';
import { RefreshToken } from './entities/refresh-token.entity';

import { RegistrationOtp } from './entities/registration-otp.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Otp,RefreshToken,RegistrationOtp,User]),MailModule,JwtModule.register({ 
    secret:process.env.JWT_SECRET || 'secret',
    signOptions:{expiresIn:'1h'}
  })],
  controllers: [AuthController],
  providers: [AuthService,UsersService,JwtStrategy],
})
export class AuthModule {}
