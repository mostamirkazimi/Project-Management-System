
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectsService } from '../../../services/project/projects.service';



@Component({
  selector: 'app-project-create',
  imports: [ReactiveFormsModule],
  templateUrl: './project-create.html',
  styleUrl: './project-create.css',
})
export class ProjectCreate {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);

  projectForm: FormGroup;

  selectedImage: File | null = null;

  imagePreview: string | null = null;

  saving = false;

  constructor() {

    this.projectForm = this.fb.group({

      name: ['', Validators.required],

      description: [''],

      status: ['PLANNING', Validators.required],

      priority: ['MEDIUM', Validators.required],

      startDate: [''],

      dueDate: [''],

    });

  }


  // =========================
  // SELECT IMAGE
  // =========================

  onImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.selectedImage = file;


    // Preview

    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };

    reader.readAsDataURL(file);

  }


  // =========================
  // CREATE PROJECT
  // =========================

  submit(): void {

    if (this.projectForm.invalid) {

      this.projectForm.markAllAsTouched();

      return;

    }

    this.saving = true;


    this.projectsService
      .create(
        this.projectForm.value,
        this.selectedImage || undefined
      )
      .subscribe({

        next: (project) => {

          console.log(
            'Project created:',
            project
          );

          this.saving = false;


          // Go to project details

          this.router.navigate([
            '/projects',
            project.id,
          ]);

        },


        error: (error) => {

          console.error(
            'Create project error:',
            error
          );

          this.saving = false;

        },

      });

  }


  // =========================
  // CANCEL
  // =========================

  cancel(): void {

    this.router.navigate(['/projects']);

  }

}

