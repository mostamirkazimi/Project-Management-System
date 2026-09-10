import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { BlogService } from '../../../../services/blog/blog.service';
import { Blog } from '../../../../model/blog/blog.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
  ],
  templateUrl: './blog-list.html',
})
export class BlogListComponent implements OnInit {

  private readonly blogService = inject(BlogService);

  blogs: Blog[] = [];

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadBlogs();
  }

  // =========================
  // LOAD BLOGS
  // =========================

  loadBlogs(): void {

    this.loading = true;
    this.errorMessage = '';

    this.blogService.getAll().subscribe({

      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error loading blogs:',
          error,
        );

        this.errorMessage =
          'Failed to load blogs. Please try again.';

        this.loading = false;
      },

    });
  }

  // =========================
  // DELETE BLOG
  // =========================

 deleteBlog(id: number): void {
  const confirmed = confirm(
    'Are you sure you want to delete this blog? This action cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  this.blogService.delete(id).subscribe({
    next: () => {
      this.blogs = this.blogs.filter(blog => blog.id !== id);
    },

    error: (error) => {
      console.error('Error deleting blog:', error);

      this.errorMessage =
        error?.error?.message ||
        'Failed to delete blog. Please try again.';
    },
  });
}

}