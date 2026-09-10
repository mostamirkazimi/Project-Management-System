
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from './enum/role.enum';
import { Roles } from 'src/auth/decorators/roles.decoretor';

import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';


@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}


  // =========================================================
  // Create User
  // =========================================================

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }


  // =========================================================
  // Admin - Get All Users
  // =========================================================

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUsersForAdmin(
    @Query() query: AdminUsersQueryDto,
  ) {
    return this.usersService.findAll(query);
  }


  // =========================================================
  // Admin - Update User
  // =========================================================

  @Patch('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminUpdateUser(
    @Param('id') id: string,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return this.usersService.update(
      Number(id),
      adminUpdateUserDto,
    );
  }


  // =========================================================
  // Admin - Update Role
  // =========================================================

  @Patch('admin/users/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: any,
  ) {
    return this.usersService.updateRole(
      Number(id),
      req.user.userId,
      updateRoleDto.role,
    );
  }


  // =========================================================
  // Admin - Delete User
  // =========================================================

  @Delete('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteUser(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.usersService.remove(
      Number(id),
      req.user.userId,
    );
  }


  // =========================================================
  // Current Logged-in User
  // =========================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @Request() req: any,
  ) {

    console.log('REQ.USER:', req.user);

    const user = await this.usersService.findOneById(
      req.user.userId,
    );

    console.log('ME RESPONSE:', user);

    return user;
  }


  // =========================================================
  // User - Update Own Profile + Profile Image
  // =========================================================

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({

        destination: './uploads',

        filename: (
          req,
          file,
          callback,
        ) => {

          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;

          callback(
            null,
            uniqueName,
          );
        },

      }),

      fileFilter: (
        req,
        file,
        callback,
      ) => {

        if (!file.mimetype.startsWith('image/')) {

          return callback(
            new Error('Only image files are allowed'),
            false,
          );

        }

        callback(
          null,
          true,
        );
      },

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profileImage?: Express.Multer.File,
    @Req() req?: any,
  ) {

    return this.usersService.update(
      Number(id),
      updateUserDto,
      profileImage,
      req.user.userId,
    );
  }


  // =========================================================
  // Get User By ID
  // =========================================================

  @Get(':id')
  findOne(
    @Param('id') id: number,
  ) {
    return this.usersService.findOneById(id);
  }

}

