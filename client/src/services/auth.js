// client/src/services/auth.js
import api from './api';

export async function login(username, password) {
  const res = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', res.data.token);
}

export async function register(username, password, email) {
  const res = await api.post('/auth/register', { username, password, email });
  localStorage.setItem('token', res.data.token);
}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}