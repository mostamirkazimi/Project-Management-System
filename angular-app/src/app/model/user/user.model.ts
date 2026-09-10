export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: string;
  profileImage: string | null;
}

export interface AdminUsersQuery {
  page: number;
  limit: number;
  search: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  password: string;
  profileImage?: string | null;
}

export class UpdateRole {
  role!: string;
}