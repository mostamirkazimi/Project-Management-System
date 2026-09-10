import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '../../model/blog/blog.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/blog`;


  // =========================
  // GET ALL BLOGS
  // =========================

  getAll(): Observable<Blog[]> {

    return this.http.get<Blog[]>(
      this.apiUrl,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // GET ONE BLOG
  // =========================

  getById(
    id: number,
  ): Observable<Blog> {

    return this.http.get<Blog>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // CREATE BLOG
  // =========================

  create(
    data: CreateBlogRequest,
    image?: File,
  ): Observable<Blog> {

    const formData = new FormData();

    formData.append(
      'title',
      data.title,
    );

    if (data.excerpt) {
      formData.append(
        'excerpt',
        data.excerpt,
      );
    }

    formData.append(
      'content',
      data.content,
    );

    if (data.status) {
      formData.append(
        'status',
        data.status,
      );
    }

    formData.append(
      'authorId',
      data.authorId.toString(),
    );

    if (image) {
      formData.append(
        'image',
        image,
      );
    }

    return this.http.post<Blog>(
      this.apiUrl,
      formData,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // UPDATE BLOG
  // =========================

  update(
    id: number,
    data: UpdateBlogRequest,
    image?: File,
  ): Observable<Blog> {

    const formData = new FormData();

    if (data.title !== undefined) {
      formData.append(
        'title',
        data.title,
      );
    }

    if (data.excerpt !== undefined) {
      formData.append(
        'excerpt',
        data.excerpt,
      );
    }

    if (data.content !== undefined) {
      formData.append(
        'content',
        data.content,
      );
    }

    if (data.status !== undefined) {
      formData.append(
        'status',
        data.status,
      );
    }

    if (data.authorId !== undefined) {
      formData.append(
        'authorId',
        data.authorId.toString(),
      );
    }

    if (image) {
      formData.append(
        'image',
        image,
      );
    }

    return this.http.patch<Blog>(
      `${this.apiUrl}/${id}`,
      formData,
      {
        withCredentials: true,
      },
    );
  }


  // =========================
  // DELETE BLOG
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