# Project Management System

A full-stack project management application built with **Angular** and **NestJS**. The system provides authentication, project management, task management, team management, blogging, contact functionality, and user administration through a responsive and modern web interface.

## ✨ Features

### Authentication & User Management

* User registration with email OTP verification
* User login and logout
* JWT-based authentication
* Refresh token support
* Forgot password and password reset
* Change password
* User profile management
* Role-based user management
* Admin user management

### Project Management

* Create, read, update, and delete projects
* Project status management
* Project priority management
* Start and due dates
* Project image upload
* Project details and related information

### Task Management

* Create, read, update, and delete tasks
* Assign tasks to users
* Associate tasks with projects
* Task status management
* Task priority management
* Due dates
* Filter tasks by status, priority, and project
* View current user's tasks

### Team Management

* Create and manage teams
* Associate teams with projects
* Add members to teams
* View team members
* Remove members from teams

### Blog

* Create and manage blog posts
* Update and delete posts
* Blog image upload
* Blog content management

### Contact

* Contact form
* Email notification through the backend mail service

### Additional Pages

* About page
* Terms and Conditions
* Privacy Policy
* Cookie Policy
* Responsive footer and navigation

## 🛠️ Tech Stack

### Frontend

* Angular 22
* TypeScript
* Tailwind CSS
* Angular Standalone Components
* Angular SSR
* Angular Router
* Angular HttpClient
* Reactive Forms
* ngx-toastr

### Backend

* NestJS 11
* TypeScript
* PostgreSQL
* TypeORM
* JWT
* Nodemailer
* Class Validator
* Class Transformer

### Development Tools

* Git
* GitHub
* Visual Studio Code
* PostgreSQL

## 📁 Project Structure

```text
Project Management System/
│
├── angular-app/
│   ├── src/
│   │   └── app/
│   │       ├── auth/
│   │       ├── page/
│   │       ├── services/
│   │       ├── shared/
│   │       └── ...
│   ├── public/
│   └── package.json
│
├── back_nestjs/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   ├── task/
│   │   ├── team/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── mail/
│   │   └── ...
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* PostgreSQL
* Git
* Angular CLI

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/mostamirkazimi/Project-Management-System.git
```

Navigate into the project:

```bash
cd Project-Management-System
```

---

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd back_nestjs
```

Install dependencies:

```bash
npm install
```

Create your environment file:

### Windows

```bash
copy .env.example .env
```

Configure the `.env` file with your PostgreSQL, JWT, and mail settings.

Example:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT
JWT_SECRET=your_jwt_secret

# Mail
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

Start the backend in development mode:

```bash
npm run start:dev
```

The backend will run on:

```text
http://localhost:3000
```

---

## 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd angular-app
```

Install dependencies:

```bash
npm install
```

Start the Angular application:

```bash
npm start
```

The frontend will normally be available at:

```text
http://localhost:4200
```

## 🔐 Environment Variables

The backend requires environment variables for:

* PostgreSQL database connection
* JWT authentication
* Email service

The repository contains `.env.example` as a template.

**Never commit your real `.env` file or private credentials to GitHub.**

## 🔑 Authentication

The application uses JWT-based authentication.

Authentication-related functionality includes:

* Registration
* Email OTP verification
* Login
* Logout
* Token refresh
* Forgot password
* OTP verification
* Password reset
* Change password
* Current user information

The authentication system uses cookies for token handling between the Angular frontend and NestJS backend.

## 🖼️ Image Uploads

The backend supports image uploads for:

* User profiles
* Projects
* Blog posts

Uploaded files are stored in the backend upload directories and served through the `/uploads` route.

Example:

```text
/uploads/profiles/
/uploads/projects/
/uploads/blog/
```

Uploaded files and environment files are excluded from Git using `.gitignore`.

## 📡 API Overview

### Authentication

```text
/auth/register
/auth/verify-registration-otp
/auth/login
/auth/logout
/auth/refresh
/auth/forgot-password
/auth/verify-otp
/auth/reset-password
/auth/change-password
/auth/me
```

### Users

```text
/users
/users/me
/users/:id
```

### Projects

```text
/projects
/projects/:id
```

### Tasks

```text
/task
/task/my-tasks
/task/project/:projectId
/task/:id
```

### Teams

```text
/team
/team/:id
/team/:id/members
/team/:id/members/:userId
```

### Blog

```text
/blog
/blog/:id
```

## 🧩 Architecture

The application follows a separated frontend/backend architecture:

```text
Angular Frontend
       │
       │ HTTP / REST API
       ▼
NestJS Backend
       │
       ├── Authentication
       ├── Users
       ├── Projects
       ├── Tasks
       ├── Teams
       ├── Blog
       ├── Contact
       └── Mail
       │
       ▼
   PostgreSQL
```

This structure keeps the frontend presentation layer separate from the backend business logic and database layer.

## 📱 Responsive Design

The frontend is designed with responsive layouts using Tailwind CSS and supports:

* Desktop
* Tablet
* Mobile

The UI uses reusable Angular components and modern standalone component architecture.

## 🔒 Security

Security considerations implemented in the project include:

* JWT authentication
* Cookie-based token handling
* Password hashing
* OTP-based verification
* Environment variables for sensitive configuration
* `.gitignore` protection for `.env`
* Exclusion of uploaded files from Git

## 🔮 Future Improvements

Possible future improvements include:

* Production deployment
* CI/CD pipeline
* Automated testing
* Environment-based frontend API configuration
* Advanced dashboard analytics
* Notifications
* Real-time task and team updates
* Additional project permissions

## 👨‍💻 Author

**Mostamir Kazimi**

GitHub: `mostamirkazimi`

## 📄 License

No license has been specified for this project yet.
