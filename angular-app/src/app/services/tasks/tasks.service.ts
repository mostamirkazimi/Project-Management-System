
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskRequest, Task, TaskListResponse, TaskQuery, UpdateTaskRequest } from '../../model/tasks/task.model';



@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:3000/task';


  // =========================
  // GET ALL TASKS
  // =========================

  getAll(
    query?: TaskQuery,
  ): Observable<TaskListResponse> {

    let params = new HttpParams();

    if (query?.search) {
      params = params.set(
        'search',
        query.search,
      );
    }

    if (query?.status) {
      params = params.set(
        'status',
        query.status,
      );
    }

    if (query?.priority) {
      params = params.set(
        'priority',
        query.priority,
      );
    }

    if (query?.projectId !== undefined) {
      params = params.set(
        'projectId',
        query.projectId,
      );
    }

    if (query?.page !== undefined) {
      params = params.set(
        'page',
        query.page,
      );
    }

    if (query?.limit !== undefined) {
      params = params.set(
        'limit',
        query.limit,
      );
    }


    return this.http.get<TaskListResponse>(
      this.apiUrl,
      {
        params,
        withCredentials: true,
      },
    );
  }


  // =========================
  // GET ONE TASK
  // =========================

  getById(
    id: number,
  ): Observable<Task> {

    return this.http.get<Task>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // GET MY TASKS
  // =========================

  getMyTasks(): Observable<Task[]> {

    return this.http.get<Task[]>(
      `${this.apiUrl}/my-tasks`,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // GET TASKS BY PROJECT
  // =========================

  getByProject(
    projectId: number,
  ): Observable<Task[]> {

    return this.http.get<Task[]>(
      `${this.apiUrl}/project/${projectId}`,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // CREATE TASK
  // =========================

  create(
    data: CreateTaskRequest,
  ): Observable<Task> {

    return this.http.post<Task>(
      this.apiUrl,
      data,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // UPDATE TASK
  // =========================

  update(
    id: number,
    data: UpdateTaskRequest,
  ): Observable<Task> {

    return this.http.patch<Task>(
      `${this.apiUrl}/${id}`,
      data,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // DELETE TASK
  // =========================

  delete(
    id: number,
  ): Observable<{ message: string }> {

    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }

}

