import { auth } from '@/lib/firebase';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;
  const headers = new Headers(init.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${apiUrl}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload.data as T;
}

export const api = {
  listAssignments: () => request<unknown[]>('/api/assignments'),
  createAssignment: (input: unknown) => request<unknown>('/api/assignments', { method: 'POST', body: JSON.stringify(input) }),
  updateAssignment: (id: string, input: unknown) => request<unknown>(`/api/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteAssignment: (id: string) => request<void>(`/api/assignments/${id}`, { method: 'DELETE' }),
  analyzePdf: (file: File) => {
    const body = new FormData();
    body.append('file', file);
    return request<unknown>('/api/assignments/analyze-pdf', { method: 'POST', body });
  },
};