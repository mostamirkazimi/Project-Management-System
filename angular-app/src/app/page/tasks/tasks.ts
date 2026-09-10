
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority } from '../../model/tasks/task.model';
import { TasksService } from '../../services/tasks/tasks.service';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/project/projects.service';
import { Project } from '../../model/project/project.model';



@Component({
  selector: 'app-tasks',
  imports: [FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {

  // =========================
  // TASKS
  // =========================

  tasks: Task[] = [];
  projects: Project[] = [];
  private readonly tasksService = inject(TasksService);
  private readonly projectsService = inject(ProjectsService);


  // =========================
  // LOADING
  // =========================

  loading = false;


  // =========================
  // ERROR
  // =========================

  errorMessage = '';


  // =========================
  // SEARCH
  // =========================

  search = '';


  // =========================
  // FILTERS
  // =========================

  selectedStatus: TaskStatus | '' = '';

  selectedPriority: TaskPriority | '' = '';

  selectedProjectId: number | null = null;


  // =========================
  // PAGINATION
  // =========================

  currentPage = 1;

  pageSize = 10;

  totalTasks = 0;

  totalPages = 0;


  showDeleteModal = false;
  taskToDelete: Task | null = null;
  deletingTaskId: number | null = null;


  // =========================
  // ENUM OPTIONS
  // =========================

  statuses: TaskStatus[] = [
    'TODO',
    'IN_PROGRESS',
    'REVIEW',
    'DONE',
  ];

  priorities: TaskPriority[] = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT',
  ];





  // =========================
  // INIT
  // =========================
  ngOnInit(): void {
    this.loadProjects();
    this.loadTasks();
  }


  loadProjects(): void {
    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
      },

      error: (error) => {
        console.error(
          'Failed to load projects:',
          error,
        );
      },
    });
  }

  // =========================
  // LOAD TASKS
  // =========================

  loadTasks(): void {

    this.loading = true;

    this.errorMessage = '';


    this.tasksService.getAll({

      search:
        this.search.trim() || undefined,

      status:
        this.selectedStatus || undefined,

      priority:
        this.selectedPriority || undefined,

      projectId:
        this.selectedProjectId ?? undefined,

      page:
        this.currentPage,

      limit:
        this.pageSize,

    }).subscribe({

      next: (response) => {

        this.tasks = response.data;

        this.totalTasks =
          response.total;

        this.totalPages =
          response.totalPages;

        this.currentPage =
          response.page;

        this.loading = false;

      },

      error: (error) => {

        console.error(
          'Failed to load tasks:',
          error,
        );

        this.errorMessage =
          'Failed to load tasks. Please try again.';

        this.loading = false;

      },

    });

  }


  // =========================
  // SEARCH
  // =========================

  searchTasks(): void {

    this.currentPage = 1;

    this.loadTasks();

  }


  // =========================
  // STATUS FILTER
  // =========================

  filterByStatus(): void {

    this.currentPage = 1;

    this.loadTasks();

  }


  // =========================
  // PRIORITY FILTER
  // =========================

  filterByPriority(): void {

    this.currentPage = 1;

    this.loadTasks();

  }

  filterByProject(): void {
    this.currentPage = 1;
    this.loadTasks();
  }


  // =========================
  // PAGE
  // =========================

  goToPage(
    page: number,
  ): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.loadTasks();

  }


  // =========================
  // TRACK TASK
  // =========================

  trackByTaskId(
    index: number,
    task: Task,
  ): number {

    return task.id;

  }

 openDeleteModal(task: Task): void {
  this.taskToDelete = task;
  this.showDeleteModal = true;
  this.errorMessage = '';
}

closeDeleteModal(): void {
  if (this.deletingTaskId !== null) return;

  this.showDeleteModal = false;
  this.taskToDelete = null;
}

deleteTask(): void {
  if (!this.taskToDelete) return;

  const taskId = this.taskToDelete.id;

  this.deletingTaskId = taskId;
  this.errorMessage = '';

  this.tasksService.delete(taskId).subscribe({
    next: () => {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.totalTasks--;

      this.deletingTaskId = null;
      this.showDeleteModal = false;
      this.taskToDelete = null;
    },
    error: (error) => {
      console.error('Failed to delete task:', error);

      this.errorMessage =
        error?.error?.message ||
        'Failed to delete task. Please try again.';

      this.deletingTaskId = null;
    },
  });
}

}

