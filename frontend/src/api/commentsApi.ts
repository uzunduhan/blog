import api from './axios';
import type { Comment, CreateCommentPayload } from '../types/comment';

export const getByPost = (postId: number): Promise<Comment[]> =>
  api.get(`/posts/${postId}/comments`).then((r) => r.data);

export const createComment = (postId: number, data: CreateCommentPayload): Promise<Comment> =>
  api.post(`/posts/${postId}/comments`, data).then((r) => r.data);

export const deleteComment = (postId: number, commentId: number): Promise<void> =>
  api.delete(`/posts/${postId}/comments/${commentId}`).then(() => undefined);
