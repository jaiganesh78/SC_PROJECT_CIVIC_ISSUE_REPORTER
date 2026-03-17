import api from './api';

export async function registerUser(data: { name: string; email: string; password: string }) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post('/auth/login', data);
  const { token, user } = response.data;
  localStorage.setItem('civic_token', token);
  localStorage.setItem('civic_user', JSON.stringify(user));
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/user/me');
  return response.data;
}
