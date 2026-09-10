import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../../services/blog/blog.service';
import { Blog } from '../../../../model/blog/blog.model';


@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly route = inject(ActivatedRoute);

  blog: Blog | null = null;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid blog ID.';
      return;
    }

    this.loadBlog(id);
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading blog:', error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to load blog. Please try again.';

        this.loading = false;
      },
    });
  }
}