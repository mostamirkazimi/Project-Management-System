
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectsService } from '../../../services/project/projects.service';
import { Project } from '../../../model/project/project.model';



@Component({
  selector: 'app-project-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './project-edit.html',
  styleUrl: './project-edit.css',
})
export class ProjectEdit implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly projectsService = inject(ProjectsService);

  project: Project | null = null;

  projectForm!: FormGroup;

  selectedImage: File | null = null;

  imagePreview: string | null = null;

  loading = true;

  saving = false;

  error = false;


  ngOnInit(): void {

    // Create form

    this.projectForm = this.fb.group({

      name: ['', Validators.required],

      description: [''],

      status: ['PLANNING', Validators.required],

      priority: ['MEDIUM', Validators.required],

      startDate: [''],

      dueDate: [''],

    });


    // Get project ID from URL

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    if (!id) {

      this.error = true;

      this.loading = false;

      return;

    }


    // Get project

    this.projectsService.getById(id).subscribe({

      next: (project) => {

        this.project = project;

        this.projectForm.patchValue({

          name: project.name,

          description: project.description || '',

          status: project.status,

          priority: project.priority,

          startDate: project.startDate || '',

          dueDate: project.dueDate || '',

        });


        // Existing image

        if (project.image) {

          this.imagePreview =
            'http://localhost:3000' + project.image;

        }


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'Error loading project:',
          error
        );

        this.error = true;

        this.loading = false;

      },

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


    // Preview new image

    const reader = new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };

    reader.readAsDataURL(file);

  }


  // =========================
  // UPDATE PROJECT
  // =========================

  submit(): void {

    if (
      this.projectForm.invalid ||
      !this.project
    ) {

      this.projectForm.markAllAsTouched();

      return;

    }


    this.saving = true;


    this.projectsService
      .update(
        this.project.id,
        this.projectForm.value,
        this.selectedImage || undefined
      )
      .subscribe({

        next: (updatedProject) => {

          console.log(
            'Project updated:',
            updatedProject
          );


          this.saving = false;


          // Go back to details

          this.router.navigate([
            '/projects',
            updatedProject.id,
          ]);

        },


        error: (error) => {

          console.error(
            'Update project error:',
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

    if (this.project) {

      this.router.navigate([
        '/projects',
        this.project.id,
      ]);

    } else {

      this.router.navigate(['/projects']);

    }

  }

}

