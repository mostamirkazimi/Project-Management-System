import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest, Project, UpdateProjectRequest } from '../../model/project/project.model';



@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/projects';

  // =========================
  // GET ALL PROJECTS
  // =========================

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl,{
      withCredentials:true
    });
  }

  // =========================
  // GET ONE PROJECT
  // =========================

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(
      `${this.apiUrl}/${id}`,
    );
  }

  // =========================
  // CREATE PROJECT
  // =========================

  create(
    data: CreateProjectRequest,
    image?: File,
  ): Observable<Project> {
    const formData = new FormData();

    formData.append('name', data.name);

    if (data.description) {
      formData.append(
        'description',
        data.description,
      );
    }

    if (data.status) {
      formData.append('status', data.status);
    }

    if (data.priority) {
      formData.append('priority', data.priority);
    }

    if (data.startDate) {
      formData.append(
        'startDate',
        data.startDate,
      );
    }

    if (data.dueDate) {
      formData.append(
        'dueDate',
        data.dueDate,
      );
    }

    if (image) {
      formData.append(
        'image',
        image,
      );
    }

    return this.http.post<Project>(
      this.apiUrl,
      formData,
    );
  }

  // =========================
  // UPDATE PROJECT
  // =========================

  update(
    id: number,
    data: UpdateProjectRequest,
    image?: File,
  ): Observable<Project> {
    const formData = new FormData();

    if (data.name !== undefined) {
      formData.append(
        'name',
        data.name,
      );
    }

    if (data.description !== undefined) {
      formData.append(
        'description',
        data.description,
      );
    }

    if (data.status !== undefined) {
      formData.append(
        'status',
        data.status,
      );
    }

    if (data.priority !== undefined) {
      formData.append(
        'priority',
        data.priority,
      );
    }

    if (data.startDate !== undefined) {
      formData.append(
        'startDate',
        data.startDate,
      );
    }

    if (data.dueDate !== undefined) {
      formData.append(
        'dueDate',
        data.dueDate,
      );
    }

    if (image) {
      formData.append(
        'image',
        image,
      );
    }

    return this.http.patch<Project>(
      `${this.apiUrl}/${id}`,
      formData,
    );
  }

  // =========================
  // DELETE PROJECT
  // =========================

  delete(id: number): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.apiUrl}/${id}`,
    );
  }
}