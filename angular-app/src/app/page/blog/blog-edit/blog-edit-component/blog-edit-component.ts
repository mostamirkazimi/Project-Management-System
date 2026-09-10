import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../../services/blog/blog.service';
import { UserService } from '../../../../services/users/user.service';
import { Blog, BlogStatus, UpdateBlogRequest } from '../../../../model/blog/blog.model';
import { User } from '../../../../model/user/user.model';


@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: 'blog-edit-component.html',
})
export class BlogEditComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private usersSubscription?: Subscription;

  blog: Blog | null = null;
  users: User[] = [];

  blogId!: number;

  selectedImage?: File;
  imagePreview: string | null = null;

  loading = false;
  loadingUsers = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  readonly BlogStatus = BlogStatus;

  blogForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    excerpt: ['', [Validators.maxLength(500)]],
    content: ['', [Validators.required]],
    status: [BlogStatus.DRAFT, [Validators.required]],
    authorId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid blog ID.';
      return;
    }

    this.blogId = id;

    this.loadUsers();
    this.loadBlog();
  }

  loadBlog(): void {
    this.loading = true;
    this.errorMessage = '';

    this.blogService.getById(this.blogId).subscribe({
      next: (blog) => {
        this.blog = blog;

        this.blogForm.patchValue({
          title: blog.title,
          excerpt: blog.excerpt ?? '',
          content: blog.content,
          status: blog.status,
          authorId: blog.authorId,
        });

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

  loadUsers(): void {
    this.loadingUsers = true;

    this.usersSubscription = this.userService.getAllUsersForAdmin().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },

      error: (error) => {
        console.error('Error loading users:', error);

        this.errorMessage = 'Failed to load authors.';
        this.loadingUsers = false;
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.selectedImage = file;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  }

  removeNewImage(): void {
    this.selectedImage = undefined;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = null;
  }

  submit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.blogForm.getRawValue();

    const data: UpdateBlogRequest = {
      title: formValue.title.trim(),
      excerpt: formValue.excerpt.trim(),
      content: formValue.content.trim(),
      status: formValue.status,
      authorId: Number(formValue.authorId),
    };

    this.blogService.update(
      this.blogId,
      data,
      this.selectedImage
    ).subscribe({
      next: (updatedBlog) => {
        this.blog = updatedBlog;

        this.saving = false;
        this.successMessage = 'Blog updated successfully.';

        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 800);
      },

      error: (error) => {
        console.error('Error updating blog:', error);

        this.saving = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to update blog. Please try again.';
      },
    });
  }

  ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}