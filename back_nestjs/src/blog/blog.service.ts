import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Blog } from './entities/blog.entity';
import { User } from '../users/entities/user.entity';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create Blog
  async create(
    createBlogDto: CreateBlogDto,
    image?: Express.Multer.File,
  ): Promise<Blog> {

    const author = await this.userRepository.findOne({
      where: {
        id: createBlogDto.authorId,
      },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const blog = this.blogRepository.create({
      ...createBlogDto,

      image: image
        ? `/uploads/blogs/${image.filename}`
        : null,

      author,
    });

    return this.blogRepository.save(blog);
  }

  // Get All Blogs
  async findAll(): Promise<Blog[]> {

    return this.blogRepository.find({
      relations: {
        author: true,
      },

      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Get One Blog
  async findOne(id: number): Promise<Blog> {

    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },

      relations: {
        author: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  // Update Blog
  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    image?: Express.Multer.File,
  ): Promise<Blog> {

    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (updateBlogDto.authorId) {

      const author = await this.userRepository.findOne({
        where: {
          id: updateBlogDto.authorId,
        },
      });

      if (!author) {
        throw new NotFoundException('Author not found');
      }

      blog.author = author;
      blog.authorId = author.id;
    }

    Object.assign(blog, updateBlogDto);

    if (image) {
      blog.image = `/uploads/blogs/${image.filename}`;
    }

    return this.blogRepository.save(blog);
  }

  // Delete Blog
  async remove(id: number): Promise<{ message: string }> {

    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    await this.blogRepository.remove(blog);

    return {
      message: 'Blog deleted successfully',
    };
  }
}