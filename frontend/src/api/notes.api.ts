import { api } from './api';
import type { Note } from '../types/types';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export const notesApi = {
  getAll: (q?: string) =>
    api.get<ApiResponse<Note[]>>('/notes', {
      params: q ? { q } : undefined,
    }),

  create: (title: string, text: string) =>
    api.post('/notes', { title, text }),

  update: (id: number, title: string, text: string) =>
    api.put(`/notes/${id}`, { title, text }),
};
