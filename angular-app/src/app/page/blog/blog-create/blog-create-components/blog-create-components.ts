import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from '../../../../services/blog/blog.service';
import { UserService } from '../../../../services/users/user.service';
import { User } from '../../../../model/user/user.model';
import { BlogStatus, CreateBlogRequest } from '../../../../model/blog/blog.model';


@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './blog-create-components.html',
})
export class BlogCreateComponent implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  private usersSubscription?: Subscription;

  users: User[] = [];

  selectedImage?: File;
  imagePreview: string | null = null;

  loadingUsers = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  readonly BlogStatus = BlogStatus;

  blogForm = this.fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(255),
      ],
    ],

    excerpt: [
      '',
      [
        Validators.maxLength(500),
      ],
    ],

    content: [
      '',
      [
        Validators.required,
      ],
    ],

    status: [
      BlogStatus.DRAFT,
      [
        Validators.required,
      ],
    ],

    authorId: [
      0,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
  });


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.loadUsers();
  }


  // =========================
  // LOAD USERS
  // =========================

  loadUsers(): void {

    this.loadingUsers = true;

    this.usersSubscription =
      this.userService.getAllUsersForAdmin().subscribe({

        next: (users) => {
          this.users = users;
          this.loadingUsers = false;
        },

        error: (error) => {

          console.error(
            'Error loading users:',
            error,
          );

          this.errorMessage =
            'Failed to load authors.';

          this.loadingUsers = false;
        },

      });
  }


  // =========================
  // IMAGE SELECT
  // =========================

  onImageSelected(
    event: Event,
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.selectedImage = file;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview =
      URL.createObjectURL(file);
  }


  // =========================
  // REMOVE IMAGE
  // =========================

  removeImage(): void {

    this.selectedImage = undefined;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = null;
  }


  // =========================
  // SUBMIT
  // =========================

  submit(): void {

    if (this.blogForm.invalid) {

      this.blogForm.markAllAsTouched();

      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue =
      this.blogForm.getRawValue();

    const data: CreateBlogRequest = {
      title: formValue.title.trim(),
      excerpt: formValue.excerpt.trim(),
      content: formValue.content.trim(),
      status: formValue.status,
      authorId: Number(formValue.authorId),
    };

    this.blogService.create(
      data,
      this.selectedImage,
    ).subscribe({

      next: () => {

        this.saving = false;

        this.successMessage =
          'Blog created successfully.';

        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 800);
      },

      error: (error) => {

        console.error(
          'Error creating blog:',
          error,
        );

        this.saving = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to create blog. Please try again.';
      },

    });
  }


  // =========================
  // DESTROY
  // =========================

  ngOnDestroy(): void {

    this.usersSubscription?.unsubscribe();

    if (this.imagePreview) {
      URL.revokeObjectURL(
        this.imagePreview,
      );
    }
  }

}