import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getAuthHeaders() {
  try {
    const token = await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Error al obtener token de AsyncStorage:', error);
    return {};
  }
}

// Función helper para manejar respuestas de la API
async function handleResponse(res, operation) {
  const text = await res.text();
  let data = {};
  
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`Error al parsear respuesta JSON en ${operation}:`, error);
    throw new Error('Respuesta del servidor inválida');
  }

  if (!res.ok) {
    const errorMessage = data?.message || `Error en ${operation}`;
    console.error(`${operation} failed:`, { status: res.status, message: errorMessage });
    throw new Error(errorMessage);
  }

  return data;
}

export async function apiGet(path, auth = false, params) {
  try {
    const url = new URL(`${API_BASE_URL}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          url.searchParams.append(k, String(v));
        }
      });
    }
    
    const headers = { 
      'Content-Type': 'application/json', 
      ...(auth ? await getAuthHeaders() : {}) 
    };
    
    console.log(`GET ${url.toString()}`);
    const res = await fetch(url.toString(), { headers });
    
    return await handleResponse(res, `GET ${path}`);
  } catch (error) {
    console.error(`Error en GET ${path}:`, error);
    throw error;
  }
}

export async function apiPost(path, body, auth = false) {
  try {
    const headers = { 
      'Content-Type': 'application/json', 
      ...(auth ? await getAuthHeaders() : {}) 
    };
    
    console.log(`POST ${API_BASE_URL}${path}`, body);
    const res = await fetch(`${API_BASE_URL}${path}`, { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(body) 
    });
    
    return await handleResponse(res, `POST ${path}`);
  } catch (error) {
    console.error(`Error en POST ${path}:`, error);
    throw error;
  }
}

export async function apiDelete(path, auth = false) {
  try {
    const headers = { 
      'Content-Type': 'application/json', 
      ...(auth ? await getAuthHeaders() : {}) 
    };
    
    console.log(`DELETE ${API_BASE_URL}${path}`);
    const res = await fetch(`${API_BASE_URL}${path}`, { 
      method: 'DELETE', 
      headers 
    });
    
    return await handleResponse(res, `DELETE ${path}`);
  } catch (error) {
    console.error(`Error en DELETE ${path}:`, error);
    throw error;
  }
}

export async function apiPut(path, body, auth = false) {
  try {
    const headers = { 
      'Content-Type': 'application/json', 
      ...(auth ? await getAuthHeaders() : {}) 
    };
    
    console.log(`PUT ${API_BASE_URL}${path}`, body);
    const res = await fetch(`${API_BASE_URL}${path}`, { 
      method: 'PUT', 
      headers, 
      body: JSON.stringify(body) 
    });
    
    return await handleResponse(res, `PUT ${path}`);
  } catch (error) {
    console.error(`Error en PUT ${path}:`, error);
    throw error;
  }
}


