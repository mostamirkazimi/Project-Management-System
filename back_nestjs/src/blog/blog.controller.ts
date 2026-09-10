import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { BlogService } from './blog.service';

import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {

  constructor(
    private readonly blogService: BlogService,
  ) {}

  // Create Blog
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',

        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e8)}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),
    }),
  )
 create(
  @Body() createBlogDto: CreateBlogDto,
  @UploadedFile() image?: Express.Multer.File,
) {
  createBlogDto.authorId = Number(createBlogDto.authorId);

  return this.blogService.create(
    createBlogDto,
    image,
  );
}

  // Get All Blogs
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  // Get One Blog
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.blogService.findOne(id);
  }

  // Update Blog
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',

        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e8)}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.blogService.update(
      id,
      updateBlogDto,
      image,
    );
  }

  // Delete Blog
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.blogService.remove(id);
  }
}