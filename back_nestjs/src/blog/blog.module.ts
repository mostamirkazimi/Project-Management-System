import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { User } from 'src/users/entities/user.entity';
import { Blog } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
