import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../services/project/projects.service';
import { Project } from '../../../model/project/project.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  imports: [DatePipe],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);

  project: Project | null = null;

  loading = true;
  deleting = false;

  error = false;
  showDeleteModal = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.loadProject(id);
  }

  private loadProject(id: number): void {

    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.projectsService.getById(id).subscribe({

      next: (project) => {

        this.project = project;
        this.loading = false;

        console.log('Project:', project);
      },

      error: (error) => {

        console.error('Project details error:', error);

        this.error = true;
        this.loading = false;

        this.errorMessage =
          error?.error?.message || 'Project could not be found.';
      },

    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  editProject(): void {

    if (!this.project) {
      return;
    }

    this.router.navigate([
      '/projects',
      this.project.id,
      'edit'
    ]);
  }

  openDeleteModal(): void {

    if (!this.project || this.deleting) {
      return;
    }

    this.showDeleteModal = true;
    this.errorMessage = '';
  }

  closeDeleteModal(): void {

    if (this.deleting) {
      return;
    }

    this.showDeleteModal = false;
  }

  deleteProject(): void {

    if (!this.project || this.deleting) {
      return;
    }

    this.deleting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.projectsService.delete(this.project.id).subscribe({

      next: () => {

        this.deleting = false;
        this.showDeleteModal = false;

        this.successMessage = 'Project deleted successfully.';

        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 700);
      },

      error: (error) => {

        console.error('Failed to delete project:', error);

        this.deleting = false;

        this.errorMessage =
          error?.error?.message || 'Failed to delete project.';
      },

    });
  }
}