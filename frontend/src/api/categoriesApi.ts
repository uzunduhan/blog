import api from './axios';
import type { Category } from '../types/category';

export const getAll = (): Promise<Category[]> =>
  api.get('/categories').then((r) => r.data);

export const createCategory = (name: string): Promise<Category> =>
  api.post('/categories', { name }).then((r) => r.data);

export const deleteCategory = (id: number): Promise<void> =>
  api.delete(`/categories/${id}`).then(() => undefined);
