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

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  // =========================
  // CREATE PROJECT
  // =========================

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/projects',

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

          callback(
            null,
            `${uniqueName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.projectsService.create(
      createProjectDto,
      image,
    );
  }

  // =========================
  // GET ALL PROJECTS
  // =========================

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  // =========================
  // GET ONE PROJECT
  // =========================

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.findOne(id);
  }

  // =========================
  // UPDATE PROJECT
  // =========================

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/projects',

        filename: (req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

          callback(
            null,
            `${uniqueName}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,

    @Body() updateProjectDto: UpdateProjectDto,

    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.projectsService.update(
      id,
      updateProjectDto,
      image,
    );
  }

  // =========================
  // DELETE PROJECT
  // =========================

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.projectsService.remove(id);
  }
}