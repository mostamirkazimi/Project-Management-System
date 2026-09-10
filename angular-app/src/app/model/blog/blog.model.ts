export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface BlogAuthor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  status: BlogStatus;
  authorId: number;
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  excerpt?: string;
  content: string;
  status?: BlogStatus;
  authorId: number;
  image?: File;
}

export interface UpdateBlogRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: BlogStatus;
  authorId?: number;
  image?: File;
}