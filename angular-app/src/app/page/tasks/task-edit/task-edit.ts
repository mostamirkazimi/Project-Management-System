
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  Task,
  TaskPriority,
  TaskStatus,
} from '../../../model/tasks/task.model';

import { TasksService } from '../../../services/tasks/tasks.service';
import { Project } from '../../../model/project/project.model';
import { User } from '../../../model/user/user.model';
import { ProjectsService } from '../../../services/project/projects.service';
import { UserService } from '../../../services/users/user.service';


@Component({
  selector: 'app-task-edit',

  imports: [
    ReactiveFormsModule,
  ],

  templateUrl: './task-edit.html',

  styleUrl: './task-edit.css',
})
export class TaskEdit implements OnInit {

  // =========================
  // INJECT
  // =========================

  private readonly fb = inject(FormBuilder);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly tasksService = inject(TasksService);

  private readonly projectsService = inject(ProjectsService);

  private readonly userService = inject(UserService);


  // =========================
  // STATE
  // =========================

  task: Task | null = null;

  projects: Project[] = [];

  users: User[] = [];

  loading = true;

  loadingRelations = true;

  saving = false;

  errorMessage = '';

  successMessage = '';


  // =========================
  // ENUM OPTIONS
  // =========================

  readonly statuses: TaskStatus[] = [
    'TODO',
    'IN_PROGRESS',
    'REVIEW',
    'DONE',
  ];

  readonly priorities: TaskPriority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ];


  // =========================
  // FORM
  // =========================

  taskForm = this.fb.nonNullable.group({

    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ],
    ],

    description: [
      '',
    ],

    status: [
      'TODO' as TaskStatus,
      Validators.required,
    ],

    priority: [
      'MEDIUM' as TaskPriority,
      Validators.required,
    ],

    dueDate: [
      '',
    ],

    projectId: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    assignedToId: [
      null as number | null,
    ],

  });


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {

      this.errorMessage =
        'Invalid task ID.';

      this.loading = false;

      return;
    }

    this.loadTask(id);

    this.loadProjects();

    this.loadUsers();
  }


  // =========================
  // LOAD TASK
  // =========================

  private loadTask(id: number): void {

    this.loading = true;

    this.errorMessage = '';

    this.tasksService.getById(id).subscribe({

      next: (task) => {

        this.task = task;

        this.taskForm.patchValue({

          title: task.title,

          description:
            task.description ?? '',

          status:
            task.status,

          priority:
            task.priority,

          dueDate:
            task.dueDate
              ? task.dueDate.substring(0, 10)
              : '',

          projectId:
            task.projectId,

          assignedToId:
            task.assignedToId,

        });

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Failed to load task:',
          error,
        );

        this.errorMessage =
          error?.error?.message ||
          'Failed to load task.';

        this.loading = false;
      },

    });
  }


  // =========================
  // LOAD PROJECTS
  // =========================

  private loadProjects(): void {

    this.projectsService.getAll().subscribe({

      next: (projects) => {

        this.projects = projects;

        this.loadingRelations = false;
      },

      error: (error) => {

        console.error(
          'Failed to load projects:',
          error,
        );

        this.errorMessage =
          'Failed to load projects.';

        this.loadingRelations = false;
      },

    });
  }


  // =========================
  // LOAD USERS
  // =========================

  private loadUsers(): void {

    this.userService.getAllUsersForAdmin().subscribe({

      next: (users) => {

        this.users = users;

      },

      error: (error) => {

        console.error(
          'Failed to load users:',
          error,
        );

        this.errorMessage =
          'Failed to load users.';
      },

    });
  }


  // =========================
  // SUBMIT
  // =========================

  onSubmit(): void {

    this.successMessage = '';

    this.errorMessage = '';

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();

      return;
    }

    if (!this.task) {

      this.errorMessage =
        'Task information is not available.';

      return;
    }


    this.saving = true;


    const formValue =
      this.taskForm.getRawValue();


    const data = {

      title:
        formValue.title.trim(),

      description:
        formValue.description.trim(),

      status:
        formValue.status,

      priority:
        formValue.priority,

      dueDate:
        formValue.dueDate || null,

      projectId:
        Number(formValue.projectId),

      assignedToId:
        formValue.assignedToId !== null
          ? Number(formValue.assignedToId)
          : null,

    };


    this.tasksService
      .update(
        this.task.id,
        data,
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Task updated successfully.';

          setTimeout(() => {

            this.router.navigate([
              '/tasks',
              this.task?.id,
            ]);

          }, 700);
        },

        error: (error) => {

          console.error(
            'Failed to update task:',
            error,
          );

          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to update task.';
        },

      });
  }


  // =========================
  // CANCEL
  // =========================

  cancel(): void {

    if (this.task) {

      this.router.navigate([
        '/tasks',
        this.task.id,
      ]);

      return;
    }

    this.router.navigate([
      '/tasks',
    ]);
  }


  // =========================
  // HELPERS
  // =========================

  isInvalid(
    controlName: string,
  ): boolean {

    const control =
      this.taskForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

}

