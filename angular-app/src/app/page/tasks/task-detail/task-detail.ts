
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Task } from '../../../model/tasks/task.model';
import { TasksService } from '../../../services/tasks/tasks.service';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {

  task: Task | null = null;

  loading = true;
  deleting = false;

  errorMessage = '';
  successMessage = '';

  showDeleteModal = false;
 

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tasksService: TasksService,
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage = 'Invalid task ID.';
      this.loading = false;
      return;
    }

    this.loadTask(id);
  }

  loadTask(id: number): void {

    this.loading = true;
    this.errorMessage = '';

    this.tasksService.getById(id).subscribe({

      next: (task) => {
        this.task = task;
        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load task:', error);

        this.errorMessage =
          error?.error?.message || 'Task could not be found.';

        this.loading = false;
      },

    });
  }

  editTask(): void {

    if (!this.task) {
      return;
    }

    this.router.navigate([
      '/tasks',
      this.task.id,
      'edit',
    ]);
  }

  openDeleteModal(): void {
  if (!this.task || this.deleting) {
    return;
  }

  this.showDeleteModal = true;
}

closeDeleteModal(): void {
  if (this.deleting) {
    return;
  }

  this.showDeleteModal = false;
}

deleteTask(): void {
  if (!this.task || this.deleting) {
    return;
  }

  this.deleting = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.tasksService.delete(this.task.id).subscribe({

    next: () => {
      this.deleting = false;
      this.showDeleteModal = false;
      this.successMessage = 'Task deleted successfully.';

      setTimeout(() => {
        this.router.navigate(['/tasks']);
      }, 700);
    },

    error: (error) => {
      console.error('Failed to delete task:', error);

      this.deleting = false;

      this.errorMessage =
        error?.error?.message ||
        'Failed to delete task.';
    },

  });
}

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}

