import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../services/project/projects.service';
import { FormsModule } from '@angular/forms';
import { Project } from '../../model/project/project.model';

@Component({
  selector: 'app-projects',
  imports: [FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  constructor(
    private projectsService: ProjectsService,
    private router: Router,

  ) { }

  private readonly route = inject(ActivatedRoute)
  projects: Project[] = [];

  projectToDelete: Project | null = null;

  showDeleteModal = false;

  deleting = false;

  deleteError = '';


  createProject() {
    this.router.navigateByUrl('/projects/create');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.projectsService.getAll().subscribe({

      next: (projects) => {
        this.projects = projects;
        console.log(projects);
      },

      error: (error) => {
        console.error(error);
      },

    });

  }

  viewProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }

  editProject(): void {

    if (!this.projects) {
      return;
    }

    //this.router.navigate(['/projects', this.projects.id, 'edit']);
  }

  deleteProject(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) {
      return;
    }

    this.projectsService.delete(id).subscribe({

      next: (response) => {

        console.log(response.message);

        // Remove project from UI
        this.projects = this.projects.filter(
          project => project.id !== id
        );

      },

      error: (error) => {

        console.error(
          'Delete project error:',
          error
        );

      },

    });

  }



  openDeleteModal(project: Project): void {

    if (this.deleting) {
      return;
    }

    this.projectToDelete = project;
    this.showDeleteModal = true;
    this.deleteError = '';
  }


  closeDeleteModal(): void {

  if (this.deleting) {
    return;
  }

  this.showDeleteModal = false;
  this.projectToDelete = null;
  this.deleteError = '';
}

confirmDelete(): void {

  if (!this.projectToDelete || this.deleting) {
    return;
  }

  this.deleting = true;
  this.deleteError = '';

  const projectId = this.projectToDelete.id;

  this.projectsService.delete(projectId).subscribe({

    next: () => {

      this.projects = this.projects.filter(
        project => project.id !== projectId
      );

      this.deleting = false;
      this.showDeleteModal = false;
      this.projectToDelete = null;

    },

    error: (error) => {

      console.error('Failed to delete project:', error);

      this.deleting = false;

      this.deleteError =
        error?.error?.message ||
        'Failed to delete project.';

    },

  });
}

}