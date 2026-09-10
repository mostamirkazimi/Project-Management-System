
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
} from '@angular/router';

import {
  TaskPriority,
  TaskStatus,
} from '../../../model/tasks/task.model';

import {
  TasksService,
} from '../../../services/tasks/tasks.service';




import {
  Project,
} from '../../../model/project/project.model';

import {
  User,
} from '../../../model/user/user.model';
import { ProjectsService } from '../../../services/project/projects.service';
import { UserService } from '../../../services/users/user.service';


@Component({
  selector: 'app-task-create',

  imports: [
    ReactiveFormsModule,
  ],

  templateUrl: './task-create.html',

  styleUrl: './task-create.css',
})
export class TaskCreate implements OnInit {

  // =========================
  // INJECT
  // =========================

  private readonly fb = inject(FormBuilder);

  private readonly router = inject(Router);

  private readonly tasksService = inject(TasksService);

  private readonly projectsService = inject(ProjectsService);

  private readonly userService = inject(UserService);


  // =========================
  // STATE
  // =========================

  saving = false;

  loading = false;

  errorMessage = '';

  successMessage = '';
  
  minDueDate = '';

  // =========================
  // DATA
  // =========================

  projects: Project[] = [];

  users: User[] = [];


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

  getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'TODO':
      return 'To Do';

    case 'IN_PROGRESS':
      return 'In Progress';

    case 'REVIEW':
      return 'Review';

    case 'DONE':
      return 'Done';

    default:
      return status;
  }
}

getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case 'LOW':
      return 'Low';

    case 'MEDIUM':
      return 'Medium';

    case 'HIGH':
      return 'High';

    case 'URGENT':
      return 'Urgent';

    default:
      return priority;
  }
}

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

    this.loadProjects();
      this.minDueDate = this.getTodayDate();
    this.loadUsers();

  }


  // =========================
  // LOAD PROJECTS
  // =========================

  private loadProjects(): void {

    this.loading = true;

    this.projectsService.getAll().subscribe({

      next: (projects) => {

        this.projects = projects;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load projects:',
          error,
        );

        this.errorMessage =
          'Failed to load projects.';

        this.loading = false;

      },

    });

  }


  // =========================
  // LOAD USERS
  // =========================

  private loadUsers(): void {

    this.userService
      .getAllUsersForAdmin()
      .subscribe({

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

    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // VALIDATE
    // =========================

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();

      return;

    }


    this.saving = true;


    const formValue =
      this.taskForm.getRawValue();


    // =========================
    // CREATE DATA
    // =========================

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
        formValue.dueDate || undefined,

      projectId:
        Number(formValue.projectId),

      assignedToId:
        formValue.assignedToId
          ? Number(formValue.assignedToId)
          : null,

    };


    console.log(
      'CREATE TASK DATA:',
      data,
    );


    // =========================
    // API REQUEST
    // =========================

    this.tasksService
      .create(data)
      .subscribe({

        next: () => {

          this.saving = false;

          this.successMessage =
            'Task created successfully.';


          // =========================
          // RESET FORM
          // =========================

          this.taskForm.reset({

            title: '',

            description: '',

            status: 'TODO',

            priority: 'MEDIUM',

            dueDate: '',

            projectId: 0,

            assignedToId: null,

          });


          // =========================
          // NAVIGATE
          // =========================

          setTimeout(() => {

            this.router.navigate([
              '/tasks',
            ]);

          }, 700);

        },


        error: (error) => {

          console.error(
            'CREATE TASK ERROR:',
            error,
          );

          this.saving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to create task.';

        },

      });

  }


  // =========================
  // CANCEL
  // =========================

  cancel(): void {

    this.router.navigate([
      '/tasks',
    ]);

  }


  // =========================
  // VALIDATION
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

  private getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

}

