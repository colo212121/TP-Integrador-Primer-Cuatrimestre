import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path, auth = false, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, String(v));
    });
  }
  const headers = { 'Content-Type': 'application/json', ...(auth ? await getAuthHeaders() : {}) };
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(auth ? await getAuthHeaders() : {}) };
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || 'Error de servidor');
  return data;
}

export async function apiDelete(path, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(auth ? await getAuthHeaders() : {}) };
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE', headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || 'Error de servidor');
  return data;
}

export async function apiPut(path, body, auth = false) {
  const headers = { 'Content-Type': 'application/json', ...(auth ? await getAuthHeaders() : {}) };
  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'PUT', headers, body: JSON.stringify(body) });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || 'Error de servidor');
  return data;
}


