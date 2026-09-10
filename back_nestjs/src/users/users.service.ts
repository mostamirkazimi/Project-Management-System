import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './enum/role.enum';
import { AdminUsersQueryDto } from './dto/admin-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
 async create(createUserDto: CreateUserDto) {
   
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    
    return user;
  }



 async findAll(query: AdminUsersQueryDto = new AdminUsersQueryDto()) {
  const {
    page = 1,
    limit = 10,
    search,
  } = query;

  const queryBuilder = this.userRepository
    .createQueryBuilder('user');

  if (search) {
    queryBuilder.where(
      `(
        user.firstName ILIKE :search
        OR user.lastName ILIKE :search
        OR user.email ILIKE :search
      )`,
      {
        search: `%${search}%`,
      },
    );
  }

  const [users, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  const safeUsers = users.map(({ password, ...user }) => user);

  return {
    data: safeUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
  

  async   findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
  return await this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email })
    .getOne();
}



async update(
  id: number,
  updateUserDto: UpdateUserDto,
  profileImage?: Express.Multer.File,
  currentUserId?: number,
) {

  // =========================================================
  // Find User
  // =========================================================

  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }


  // =========================================================
  // Security
  // User can only update their own profile
  // =========================================================

  if (
    currentUserId !== undefined &&
    user.id !== currentUserId
  ) {
    throw new ForbiddenException(
      'You can only update your own profile',
    );
  }


  // =========================================================
  // Prepare Update Data
  // =========================================================

  const updateData: Partial<User> = {
    firstName: updateUserDto.firstName,
    lastName: updateUserDto.lastName,
    email: updateUserDto.email,
    phone: updateUserDto.phone,
    address: updateUserDto.address,
    city: updateUserDto.city,
  };


  // =========================================================
  // Profile Image
  // =========================================================

  if (profileImage) {

    updateData.profileImage =
      `/uploads/${profileImage.filename}`;

  }


  // =========================================================
  // Update User
  // =========================================================

  await this.userRepository.update(
    id,
    updateData,
  );


  // =========================================================
  // Get Updated User
  // =========================================================

  const updatedUser =
    await this.userRepository.findOne({
      where: { id },
    });


  if (!updatedUser) {
    throw new NotFoundException(
      'User not found',
    );
  }


  // =========================================================
  // Remove Password From Response
  // =========================================================

  const {
    password,
    ...safeUser
  } = updatedUser;


  return safeUser;
}



  async updatePassword(id: number, password: string) {
    await this.userRepository.update(
      id,
      { password },
    );
  }

  async updateRole(id: number, currentUserId: number, role: Role) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Admin نمی‌تواند Role خودش را تغییر دهد
  if (user.id === currentUserId) {
    throw new ForbiddenException(
      'You cannot change your own role',
    );
  }

  // Admin نمی‌تواند Role یک Admin دیگر را تغییر دهد
  if (user.role === Role.ADMIN) {
    throw new ForbiddenException(
      'You cannot change another admin role',
    );
  }

  await this.userRepository.update(id, {
    role,
  });

  const updatedUser = await this.userRepository.findOne({
    where: { id },
  });

  if (!updatedUser) {
    throw new NotFoundException('User not found');
  }

  const { password, ...safeUser } = updatedUser;

  return safeUser;
}

 async remove(id: number, currentUserId: number) {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Admin نمی‌تواند خودش را حذف کند
  if (user.id === currentUserId) {
    throw new ForbiddenException(
      'You cannot delete your own account',
    );
  }

  // Admin نمی‌تواند Admin دیگری را حذف کند
  if (user.role === Role.ADMIN) {
    throw new ForbiddenException(
      'You cannot delete another admin',
    );
  }

  await this.userRepository.delete(id);

  return {
    message: 'User deleted successfully',
  };
}
 }
