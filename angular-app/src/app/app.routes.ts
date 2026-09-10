import { Routes } from '@angular/router';

import { authGuard } from './guard/auth-guard-guard';
import { BlogEditComponent } from './page/blog/blog-edit/blog-edit-component/blog-edit-component';

export const routes: Routes = [

  // =========================================================
  // Default
  // =========================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },


  // =========================================================
  // Public Routes
  // =========================================================

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent),
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component')
        .then(m => m.SignupComponent),
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password')
        .then(m => m.ResetPassword),
  },

  {
    path: 'activate-code',
    loadComponent: () =>
      import('./auth/activate-code/activate-code')
        .then(m => m.ActivateCode),
  },

  {
    path: 'activate-code-registration',
    loadComponent: () =>
      import('./auth/activate-code.component/activate-code.component')
        .then(m => m.ActivateCodeComponent),
  },


  // =========================================================
  // Protected Application
  // =========================================================

  {
    path: '',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./layout/main-layout/main-layout')
        .then(m => m.MainLayout),

    children: [

      // =======================================================
      // Dashboard
      // =======================================================

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./page/dashboard/dashboard')
            .then(m => m.Dashboard),
      },


      // =======================================================
      // Projects
      // =======================================================

      {
        path: 'projects',
        children: [

          {
            path: '',
            loadComponent: () =>
              import('./page/projects/projects')
                .then(m => m.Projects),
          },

          {
            path: 'create',
            loadComponent: () =>
              import('./page/projects/project-create/project-create')
                .then(m => m.ProjectCreate),
          },

          {
            path: ':id/edit',
            loadComponent: () =>
              import('./page/projects/project-edit/project-edit')
                .then(m => m.ProjectEdit),
          },

          {
            path: ':id',
            loadComponent: () =>
              import('./page/projects/project-details/project-details')
                .then(m => m.ProjectDetails),
          },

        ],
      },


      // =======================================================
      // Tasks
      // =======================================================

      {
        path: 'tasks',
        children: [

          {
            path: '',
            loadComponent: () =>
              import('./page/tasks/tasks')
                .then(m => m.Tasks),
          },

          {
            path: 'create',
            loadComponent: () =>
              import('./page/tasks/task-create/task-create')
                .then(m => m.TaskCreate),
          },

          {
            path: ':id/edit',
            loadComponent: () =>
              import('./page/tasks/task-edit/task-edit')
                .then(m => m.TaskEdit),
          },

          {
            path: ':id',
            loadComponent: () =>
              import('./page/tasks/task-detail/task-detail')
                .then(m => m.TaskDetail),
          },

        ],
      },


      // =======================================================
      // Teams
      // =======================================================

      {
        path: 'team',
        loadComponent: () =>
          import('./page/team/team')
            .then(m => m.TeamListComponent),
      },

      {
        path: 'teams/create',
        loadComponent: () =>
          import('./page/team/team-create/team-create')
            .then(m => m.TeamCreateComponent),
      },

      {
        path: 'teams/:id/edit',
        loadComponent: () =>
          import('./page/team/team-edit/team-edit')
            .then(m => m.TeamEdit),
      },

      {
        path: 'teams/:id',
        loadComponent: () =>
          import('./page/team/team-detail/team-detail')
            .then(m => m.TeamViewComponent),
      },


      // =======================================================
      // Users
      // =======================================================

      {
        path: 'users',
        loadComponent: () =>
          import('./page/user/user.component')
            .then(m => m.UserComponent),
      },


      // =======================================================
      // Profile
      // =======================================================

      {
        path: 'edit-profile',
        loadComponent: () =>
          import('./page/edit_profile/edit-profile.component/edit-profile.component')
            .then(m => m.EditProfileComponent),
      },


      // =======================================================
      // Authentication Settings
      // =======================================================

      {
        path: 'change-password',
        loadComponent: () =>
          import('./auth/change-password/change-password')
            .then(m => m.ChangePasswordComponent),
      },


      // =======================================================
      // Blog
      // =======================================================

      {
        path: 'blog',
        loadComponent: () =>
          import('./page/blog/blog-list/blog-list/blog-list')
            .then(m => m.BlogListComponent),
      },

      {
        path: 'blogs/create',
        loadComponent: () =>
          import('./page/blog/blog-create/blog-create-components/blog-create-components')
            .then(m => m.BlogCreateComponent),
      },

      {
        path: 'blogs/:id',
        loadComponent: () =>
          import('./page/blog/blog-detail/blog-detail.component/blog-detail.component')
            .then(m => m.BlogDetailComponent),
      },
      {
        path: 'blogs/:id/edit',
        loadComponent: () =>
          import('./page/blog/blog-edit/blog-edit-component/blog-edit-component')
            .then(m => m.BlogEditComponent),
      },


      // =======================================================
      // Contact
      // =======================================================

      {
        path: 'contact',
        loadComponent: () =>
          import('./page/contact/contact/contact')
            .then(m => m.Contact),
      },



      // =======================================================
      // About
      // =======================================================

      {
        path: 'about',
        loadComponent: () =>
          import('./page/about/about/about')
            .then(m => m.About),
      },

      {
        path: 'terms',
        loadComponent: () =>
          import('./page/terms/terms/terms').then(m => m.Terms),
      },

      {
        path: 'privacy',
        loadComponent: () =>
          import('./page/privacy/privacy/privacy').then(m => m.Privacy),
      },

      {
        path: 'cookies',
        loadComponent: () =>
          import('./page/cookies/cookies/cookies').then(m => m.Cookies),
      },

    ],
  },



  // =========================================================
  // Wildcard
  // =========================================================

  {
    path: '**',
    redirectTo: 'login',
  },

];