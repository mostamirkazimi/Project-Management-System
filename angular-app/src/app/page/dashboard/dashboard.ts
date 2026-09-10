import { Component, OnInit, inject } from '@angular/core';


import { TasksService } from '../../services/tasks/tasks.service';
import { TeamService } from '../../services/team/team.service';
import { UserService } from '../../services/users/user.service';

import { Project } from '../../model/project/project.model';
import { Task } from '../../model/tasks/task.model';
import { Team } from '../../model/team/team.model';
import { ProjectsService } from '../../services/project/projects.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private readonly teamService = inject(TeamService);
  private readonly userService = inject(UserService);

  projects: Project[] = [];
  tasks: Task[] = [];
  teams: Team[] = [];

  totalProjects = 0;
  totalTasks = 0;
  totalTeams = 0;
  totalUsers = 0;

  todoTasks = 0;
  inProgressTasks = 0;
  reviewTasks = 0;
  doneTasks = 0;

  planningProjects = 0;
  inProgressProjects = 0;
  onHoldProjects = 0;
  completedProjects = 0;
  cancelledProjects = 0;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    let completedRequests = 0;
    let hasError = false;

    const requestCompleted = (): void => {
      completedRequests++;

      if (completedRequests === 4) {
        this.loading = false;

        if (hasError) {
          this.errorMessage =
            'Some dashboard data could not be loaded.';
        }
      }
    };

    // Projects
    this.projectsService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.totalProjects = projects.length;

        this.calculateProjectStats();

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        hasError = true;
        requestCompleted();
      },
    });

    // Tasks
    this.tasksService.getAll({
      page: 1,
      limit: 100,
    }).subscribe({
      next: (response) => {
        this.tasks = response.data;
        this.totalTasks = response.total;

        this.calculateTaskStats();

        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        hasError = true;
        requestCompleted();
      },
    });

    // Teams
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.totalTeams = teams.length;
        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        hasError = true;
        requestCompleted();
      },
    });

    // Users
    this.userService.getAllUsersForAdmin().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        requestCompleted();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        hasError = true;
        requestCompleted();
      },
    });
  }

  calculateTaskStats(): void {
    this.todoTasks = this.tasks.filter(
      task => task.status === 'TODO'
    ).length;

    this.inProgressTasks = this.tasks.filter(
      task => task.status === 'IN_PROGRESS'
    ).length;

    this.reviewTasks = this.tasks.filter(
      task => task.status === 'REVIEW'
    ).length;

    this.doneTasks = this.tasks.filter(
      task => task.status === 'DONE'
    ).length;
  }

  getTaskStatusLabel(status: string): string {
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

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-700';

      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';

      case 'REVIEW':
        return 'bg-yellow-100 text-yellow-700';

      case 'DONE':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  calculateProjectStats(): void {
  this.planningProjects = this.projects.filter(
    project => project.status === 'PLANNING'
  ).length;

  this.inProgressProjects = this.projects.filter(
    project => project.status === 'IN_PROGRESS'
  ).length;

  this.onHoldProjects = this.projects.filter(
    project => project.status === 'ON_HOLD'
  ).length;

  this.completedProjects = this.projects.filter(
    project => project.status === 'COMPLETED'
  ).length;

  this.cancelledProjects = this.projects.filter(
    project => project.status === 'CANCELLED'
  ).length;
}

getUpcomingTasks(): Task[] {
  return [...this.tasks]
    .filter(task => task.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() -
        new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);
}

isTaskOverdue(dueDate: string | null): boolean {
  if (!dueDate) {
    return false;
  }

  return new Date(dueDate).getTime() < Date.now();
}
}