import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { RegistrationAuthDto } from './dto/registration.dto';
import { LoginAuthDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import _ from 'lodash';

import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forget-password.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';

import { MailService } from 'src/mail/mail.service';

import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

import * as argon2 from 'argon2';

import { RegistrationOtp } from './entities/registration-otp.entity';
import { VerifyRegistrationOtpDto } from './dto/verify-registration-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(Otp)
    readonly otp_repository: Repository<Otp>,

    @InjectRepository(RegistrationOtp)
    readonly registration_otp_repository: Repository<RegistrationOtp>,

    @InjectRepository(RefreshToken)
    readonly ref_repository: Repository<RefreshToken>,

    readonly mail_service: MailService,
  ) {}

  // =========================================================
  // Registration
  // =========================================================

  async registration(
    registrationDto: RegistrationAuthDto,
    profileImage?: any,
  ) {
    const email = registrationDto.email
      .trim()
      .toLowerCase();

    // =========================================================
    // Profile Image
    // =========================================================

    const profileImagePath = profileImage
      ? `/uploads/profiles/${profileImage.filename}`
      : undefined;

    // =========================================================
    // Check duplicate in users table
    // =========================================================

    const existingUser =
      await this.usersService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    // =========================================================
    // Check pending registration
    // =========================================================

    const existingRegistration =
      await this.registration_otp_repository.findOne({
        where: {
          email,
          verified: false,
        },
      });

    if (existingRegistration) {
      await this.registration_otp_repository.remove(
        existingRegistration,
      );
    }

    // =========================================================
    // Hash Password
    // =========================================================

    const hashedPassword = await argon2.hash(
      registrationDto.password,
      {
        type: argon2.argon2id,
      },
    );

    // =========================================================
    // Generate OTP
    // =========================================================

    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // =========================================================
    // OTP Expiration - 10 Minutes
    // =========================================================

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    // =========================================================
    // Save Pending Registration
    // =========================================================

    const registrationOtp =
      this.registration_otp_repository.create({
        firstName: registrationDto.firstName,
        lastName: registrationDto.lastName,
        email,
        phone: registrationDto.phone,
        address: registrationDto.address,
        city: registrationDto.city,
        password: hashedPassword,

        // Profile Image
        profileImage: profileImagePath,

        otp,
        expiresAt,
        verified: false,
      });

    await this.registration_otp_repository.save(
      registrationOtp,
    );

    // =========================================================
    // Send OTP Email
    // =========================================================

    await this.mail_service.sendOtpEmail(
      email,
      otp,
    );

    return {
      message:
        'Verification code sent to your email',
    };
  }

  // =========================================================
  // Verify Registration OTP
  // =========================================================

  async verifyRegistrationOtp(
    dto: VerifyRegistrationOtpDto,
  ) {
    const email = dto.email
      .trim()
      .toLowerCase();

    // =========================================================
    // Find Latest Pending Registration
    // =========================================================

    const registration =
      await this.registration_otp_repository.findOne({
        where: {
          email,
          verified: false,
        },
        order: {
          id: 'DESC',
        },
      });

    if (!registration) {
      throw new NotFoundException(
        'Registration not found',
      );
    }

    // =========================================================
    // Check OTP
    // =========================================================

    if (registration.otp !== dto.otp) {
      throw new BadRequestException(
        'Invalid verification code',
      );
    }

    // =========================================================
    // Check OTP Expiration
    // =========================================================

    if (new Date() > registration.expiresAt) {
      throw new BadRequestException(
        'Verification code has expired',
      );
    }

    // =========================================================
    // Check Existing User
    // =========================================================

    const existingUser =
      await this.usersService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    // =========================================================
    // Create User
    // =========================================================

    const newUser =
      await this.usersService.create({
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        phone: registration.phone,
        address:
          registration.address ?? undefined,
        city: registration.city,
        password: registration.password,

        // Profile Image
        profileImage:
          registration.profileImage ?? undefined,
      });

    // =========================================================
    // Delete Temporary Registration
    // =========================================================

    await this.registration_otp_repository.remove(
      registration,
    );

    // =========================================================
    // Safe Response
    // =========================================================

    return {
      message:
        'Email verified and account created successfully',

      user: _.pick(newUser, [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'address',
        'city',
        'profileImage',
      ]),
    };
  }

  // =========================================================
  // Login
  // =========================================================

  async login(loginDto: LoginAuthDto) {
    const email = loginDto.email
      .trim()
      .toLowerCase();

    const user =
      await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException(
        'User not found',
      );
    }

    // Verify Password
    const isPasswordValid =
      await argon2.verify(
        user.password,
        loginDto.password,
      );

    if (!isPasswordValid) {
      throw new BadRequestException(
        'Invalid password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Access Token
    const accessToken =
      this.jwtService.sign(
        payload,
        {
          expiresIn: '15m',
        },
      );

    // Refresh Token
    const refreshToken =
      this.jwtService.sign(
        payload,
        {
          expiresIn: '7d',
        },
      );

    // Save Refresh Token
    await this.ref_repository.save({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000,
      ),
      revoked: false,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // =========================================================
  // Change Password
  // =========================================================

  async changePassword(
    user: any,
    changePasswordDto: ChangePasswordDto,
  ) {
    const {
      currentPassword,
      newPassword,
    } = changePasswordDto;

    const existingUser =
      await this.usersService.findOneById(
        user.userId,
      );

    if (!existingUser) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const isPasswordValid =
      await argon2.verify(
        existingUser.password,
        currentPassword,
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    const hashedPassword =
      await argon2.hash(
        newPassword,
        {
          type: argon2.argon2id,
        },
      );

    await this.usersService.updatePassword(
      existingUser.id,
      hashedPassword,
    );

    return {
      message:
        'Password changed successfully',
    };
  }

  // =========================================================
  // Forgot Password
  // =========================================================

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    const email =
      forgotPasswordDto.email
        .trim()
        .toLowerCase();

    const user =
      await this.usersService.findOneByEmail(
        email,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000,
    ).toString();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    const passwordReset =
      this.otp_repository.create({
        userId: user.id,
        otp,
        expiresAt,
        used: false,
      });

    await this.otp_repository.save(
      passwordReset,
    );

    await this.mail_service.sendOtpEmail(
      user.email,
      otp,
    );

    return {
      message:
        'OTP sent successfully',
    };
  }

  // =========================================================
  // Verify OTP
  // =========================================================

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ) {
    const email =
      verifyOtpDto.email
        .trim()
        .toLowerCase();

    const user =
      await this.usersService.findOneByEmail(
        email,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const otpRecord =
      await this.otp_repository.findOne({
        where: {
          userId: user.id,
          otp: verifyOtpDto.otp,
          used: false,
        },
        order: {
          id: 'DESC',
        },
      });

    if (!otpRecord) {
      throw new BadRequestException(
        'Invalid OTP',
      );
    }

    if (
      new Date() >
      otpRecord.expiresAt
    ) {
      throw new BadRequestException(
        'OTP has expired',
      );
    }

    return {
      message:
        'OTP verified successfully',
    };
  }

  // =========================================================
  // Reset Password
  // =========================================================

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ) {
    const {
      email,
      otp,
      newPassword,
    } = resetPasswordDto;

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await this.usersService.findOneByEmail(
        normalizedEmail,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const otpRecord =
      await this.otp_repository.findOne({
        where: {
          userId: user.id,
          otp,
          used: false,
        },
      });

    if (!otpRecord) {
      throw new BadRequestException(
        'Invalid OTP',
      );
    }

    if (
      new Date() >
      otpRecord.expiresAt
    ) {
      throw new BadRequestException(
        'OTP has expired',
      );
    }

    const hashedPassword =
      await argon2.hash(
        newPassword,
        {
          type: argon2.argon2id,
        },
      );

    await this.usersService.updatePassword(
      user.id,
      hashedPassword,
    );

    otpRecord.used = true;

    await this.otp_repository.save(
      otpRecord,
    );

    return {
      message:
        'Password reset successfully',
    };
  }

  // =========================================================
  // Refresh Token
  // =========================================================

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ) {
    const {
      refreshToken,
    } = refreshTokenDto;

    const storedToken =
      await this.ref_repository.findOne({
        where: {
          token: refreshToken,
          revoked: false,
        },
      });

    if (!storedToken) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    if (
      storedToken.expiresAt <
      new Date()
    ) {
      throw new UnauthorizedException(
        'Refresh token has expired',
      );
    }

    let payload: any;

    try {
      payload =
        this.jwtService.verify(
          refreshToken,
        );
    } catch {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    const newAccessToken =
      this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          expiresIn: '15m',
        },
      );

    return {
      access_token:
        newAccessToken,
    };
  }

  // =========================================================
  // Logout
  // =========================================================

  async logout(
    logoutDto: LogoutDto,
  ) {
    const {
      refreshToken,
    } = logoutDto;

    const storedToken =
      await this.ref_repository.findOne({
        where: {
          token: refreshToken,
          revoked: false,
        },
      });

    if (!storedToken) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    storedToken.revoked = true;

    await this.ref_repository.save(
      storedToken,
    );

    return {
      message:
        'Logout successful',
    };
  }
}