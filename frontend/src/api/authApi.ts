import api from './axios';
import type { AuthResponse } from '../types/auth';

export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register', data).then((r) => r.data);

export const login = (data: { email: string; password: string }): Promise<AuthResponse> =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);
