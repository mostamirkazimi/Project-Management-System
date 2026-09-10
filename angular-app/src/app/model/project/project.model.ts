export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  image: string | null;
  priority: ProjectPriority;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  dueDate?: string;
}