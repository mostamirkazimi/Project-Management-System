import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Res,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegistrationAuthDto } from './dto/registration.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forget-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { Role } from 'src/users/enum/role.enum';
import { Roles } from './decorators/roles.decoretor';
import { RolesGuard } from './guard/roles.guard';
import { UsersService } from 'src/users/users.service';
import { VerifyRegistrationOtpDto } from './dto/verify-registration-otp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // =========================
  // Registration
  // =========================

@Post('register')
@UseInterceptors(
  FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads/profiles',

      filename: (req, file, callback) => {
        const uniqueName =
          `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;

        callback(null, uniqueName);
      },
    }),
  }),
)
registration(
  @Body() registrationAuthDto: RegistrationAuthDto,
  @UploadedFile() profileImage: any,
) {
  return this.authService.registration(
    registrationAuthDto,
    profileImage,
  );
}

  @Post('verify-registration-otp')
verifyRegistrationOtp(
  @Body() dto: VerifyRegistrationOtpDto,
) {
  return this.authService.verifyRegistrationOtp(dto);
}

  // =========================
  // Login
  // =========================

  
 @Post('login')
async login(
  @Body() loginAuthDto: LoginAuthDto,
  @Res({ passthrough: true }) response: any,
) {
  const result = await this.authService.login(loginAuthDto);

  response.cookie('access_token', result.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  response.cookie('refresh_token', result.refresh_token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    message: 'Login successful',
  };
}

  // =========================
  // Change Password
  // =========================

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {

    return this.authService.changePassword(
      req.user,
      changePasswordDto,
    );
  }

  // =========================
  // Forgot Password
  // =========================

  @Post('forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {

    return this.authService.forgotPassword(
      forgotPasswordDto,
    );
  }

  // =========================
  // Verify OTP
  // =========================

  @Post('verify-otp')
  verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {

    return this.authService.verifyOtp(
      verifyOtpDto,
    );
  }

  // =========================
  // Reset Password
  // =========================

  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {

    return this.authService.resetPassword(
      resetPasswordDto,
    );
  }

  // =========================
  // Refresh Token
  // =========================

@Post('refresh')
async refresh(
  @Req() req: any,
  @Res({ passthrough: true }) response: any,
) {

  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedException(
      'Refresh token not found',
    );
  }

  const result =
    await this.authService.refreshToken({
      refreshToken,
    });

  response.cookie(
    'access_token',
    result.access_token,
    {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    },
  );

  return {
    message: 'Access token refreshed successfully',
  };
}

  // =========================
  // Logout
  // =========================

 @Post('logout')
async logout(
  @Req() req: any,
  @Res({ passthrough: true }) response: any,
) {

  const refreshToken =
    req.cookies?.refresh_token;

  if (!refreshToken) {
    throw new UnauthorizedException(
      'Refresh token not found',
    );
  }

  const result =
    await this.authService.logout({
      refreshToken,
    });

  response.clearCookie('access_token');
  response.clearCookie('refresh_token');

  return result;
}

  // =========================
  // Admin - All Users
  // =========================

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  getAllUsersForAdmin() {

    return this.usersService.findAll();
  }

  @Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Req() req: any) {
  return req.user;
}
}