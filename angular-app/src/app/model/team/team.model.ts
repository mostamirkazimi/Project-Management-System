export interface TeamMemberUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  role: string;
  profileImage: string | null;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  user: TeamMemberUser;
  createdAt: string;
}

export interface TeamProject {
  id: number;
  name: string;
  description: string | null;
  status: string;
  image: string | null;
  priority: string;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  projectId: number;
  project?: TeamProject;
  members?: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  projectId: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  projectId?: number;
}

export interface AddTeamMemberRequest {
  userId: number;
}