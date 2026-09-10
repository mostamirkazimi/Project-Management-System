import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly project_repository: Repository<Project>,
  ) {}

  // =========================
  // CREATE PROJECT
  // =========================

  async create(
    createProjectDto: CreateProjectDto,
    image?: Express.Multer.File,
  ): Promise<Project> {
    const project = this.project_repository.create({
      ...createProjectDto,

      image: image
        ? `/uploads/projects/${image.filename}`
        : null,
    });

    return await this.project_repository.save(project);
  }

  // =========================
  // GET ALL PROJECTS
  // =========================

  async findAll(): Promise<Project[]> {
    return await this.project_repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // =========================
  // GET ONE PROJECT
  // =========================

  async findOne(id: number): Promise<Project> {
    const project = await this.project_repository.findOne({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with id ${id} not found`,
      );
    }

    return project;
  }

  // =========================
  // UPDATE PROJECT
  // =========================

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    image?: Express.Multer.File,
  ): Promise<Project> {
    const project = await this.findOne(id);

    // عکس قبلی را نگه می‌داریم
    const oldImage = project.image;

    // اطلاعات جدید Project
    Object.assign(project, updateProjectDto);

    // اگر عکس جدید ارسال شده باشد
    if (image) {
      project.image = `/uploads/projects/${image.filename}`;
    }

    // ذخیره تغییرات در Database
    const updatedProject =
      await this.project_repository.save(project);

    // اگر عکس جدید داشتیم، عکس قبلی را حذف می‌کنیم
    if (image && oldImage) {
      await this.deleteImage(oldImage);
    }

    return updatedProject;
  }

  // =========================
  // DELETE PROJECT
  // =========================

  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const project = await this.findOne(id);

    // مسیر عکس قبل از حذف Project
    const image = project.image;

    // حذف Project از Database
    await this.project_repository.remove(project);

    // حذف عکس از فولدر
    if (image) {
      await this.deleteImage(image);
    }

    return {
      message: 'Project deleted successfully',
    };
  }

  // =========================
  // DELETE IMAGE
  // =========================

  private async deleteImage(
    imagePath: string | null,
  ): Promise<void> {
    if (!imagePath) {
      return;
    }

    const filePath = join(
      process.cwd(),
      imagePath.replace(/^\/+/, ''),
    );

    try {
      await unlink(filePath);

      console.log(
        `Project image deleted: ${filePath}`,
      );
    } catch (error) {
      // اگر فایل وجود نداشت،
      // حذف Project نباید با خطا مواجه شود.
      console.log(
        `Image file not found: ${filePath}`,
      );
    }
  }
}