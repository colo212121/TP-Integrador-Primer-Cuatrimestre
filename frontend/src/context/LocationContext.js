import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para limpiar errores
  const clearError = useCallback(() => setError(null), []);

  // Obtener todas las ubicaciones
  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/event-location', true);
      setLocations(data);
      return data;
    } catch (error) {
      console.error('Error al obtener ubicaciones:', error);
      const errorMessage = error.message || 'Error al cargar ubicaciones';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una ubicación específica
  const fetchLocation = useCallback(async (locationId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet(`/event-location/${locationId}`, true);
      return data;
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      const errorMessage = error.message || 'Error al cargar ubicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva ubicación
  const createLocation = useCallback(async (locationData) => {
    setLoading(true);
    setError(null);
    try {
      const newLocation = await apiPost('/event-location', locationData, true);
      setLocations(prev => [...prev, newLocation]);
      return newLocation;
    } catch (error) {
      console.error('Error al crear ubicación:', error);
      const errorMessage = error.message || 'Error al crear ubicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar una ubicación
  const updateLocation = useCallback(async (locationId, locationData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedLocation = await apiPut(`/event-location/${locationId}`, locationData, true);
      setLocations(prev => prev.map(location => 
        location.id === locationId ? updatedLocation : location
      ));
      return updatedLocation;
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
      const errorMessage = error.message || 'Error al actualizar ubicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar una ubicación
  const deleteLocation = useCallback(async (locationId) => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/event-location/${locationId}`, true);
      setLocations(prev => prev.filter(location => location.id !== locationId));
      return true;
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      const errorMessage = error.message || 'Error al eliminar ubicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar ubicaciones por nombre
  const searchLocationsByName = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/event-location', true, { name });
      setLocations(data);
      return data;
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error);
      const errorMessage = error.message || 'Error al buscar ubicaciones';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    locations,
    loading,
    error,
    clearError,
    fetchLocations,
    fetchLocation,
    createLocation,
    updateLocation,
    deleteLocation,
    searchLocationsByName
  }), [locations, loading, error, clearError, fetchLocations, fetchLocation, createLocation, updateLocation, deleteLocation, searchLocationsByName]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocations() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocations debe ser usado dentro de LocationProvider');
  return ctx;
}
