import api from './axios';
import type { Post, CreatePostPayload, UpdatePostPayload } from '../types/post';

export const getApproved = (): Promise<Post[]> => api.get('/posts').then((r) => r.data);
export const getPending = (): Promise<Post[]> => api.get('/posts/pending').then((r) => r.data);
export const getUserPosts = (): Promise<Post[]> => api.get('/posts/my').then((r) => r.data);
export const getById = (id: number): Promise<Post> => api.get(`/posts/${id}`).then((r) => r.data);
export const createPost = (data: CreatePostPayload): Promise<Post> => api.post('/posts', data).then((r) => r.data);
export const updatePost = (id: number, data: UpdatePostPayload): Promise<Post> =>
  api.put(`/posts/${id}`, data).then((r) => r.data);
export const deletePost = (id: number): Promise<void> => api.delete(`/posts/${id}`).then(() => undefined);
export const approvePost = (id: number): Promise<void> =>
  api.post(`/posts/${id}/approve`).then(() => undefined);
