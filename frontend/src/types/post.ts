import type { Category } from './category';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  isApproved: boolean;
  authorUsername: string;
  commentCount: number;
  imageUrl?: string;
  categories: Category[];
}

export interface CreatePostPayload {
  title: string;
  content: string;
  imageUrl?: string;
  categoryIds?: number[];
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  imageUrl?: string;
  categoryIds?: number[];
}

export interface PostsQuery {
  categoryId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
