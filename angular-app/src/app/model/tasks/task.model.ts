
// =========================
// TASK ENUMS
// =========================

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'DONE';


export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';


// =========================
// USER
// =========================

export interface TaskUser {

  id: number;

  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  address?: string;

  city?: string;

  role: string;

  profileImage?: string | null;

}


// =========================
// PROJECT
// =========================

export interface TaskProject {

  id: number;

  name: string;

  description?: string | null;

  status: string;

  image?: string | null;

  priority: string;

  startDate?: string | null;

  dueDate?: string | null;

  createdAt: string;

  updatedAt: string;

}


// =========================
// TASK
// =========================

export interface Task {

  id: number;

  title: string;

  description: string | null;

  status: TaskStatus;

  priority: TaskPriority;

  dueDate: string | null;

  projectId: number;

  project: TaskProject;

  assignedToId: number | null;

  assignedTo: TaskUser | null;

  createdById: number;

  createdBy: TaskUser;

  createdAt: string;

  updatedAt: string;

}


// =========================
// TASK QUERY
// =========================

export interface TaskQuery {

  search?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  projectId?: number;

  page?: number;

  limit?: number;

}


// =========================
// PAGINATION RESPONSE
// =========================

export interface TaskListResponse {

  data: Task[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;

}


// =========================
// CREATE TASK REQUEST
// =========================

export interface CreateTaskRequest {

  title: string;

  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  dueDate?: string;

  projectId: number;

  assignedToId?: number | null;

}


// =========================
// UPDATE TASK REQUEST
// =========================

export interface UpdateTaskRequest {

  title?: string;

  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  dueDate?: string | null;

  projectId?: number;

  assignedToId?: number | null;

}

