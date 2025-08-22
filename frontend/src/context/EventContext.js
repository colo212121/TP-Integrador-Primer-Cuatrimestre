import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para limpiar errores
  const clearError = useCallback(() => setError(null), []);

  // Obtener todos los eventos
  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/event', false, params);
      setEvents(data);
      return data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      const errorMessage = error.message || 'Error al cargar eventos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un evento específico
  const fetchEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet(`/event/${eventId}`, false);
      return data;
    } catch (error) {
      console.error('Error al obtener evento:', error);
      const errorMessage = error.message || 'Error al cargar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo evento
  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await apiPost('/event', eventData, true);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error al crear evento:', error);
      const errorMessage = error.message || 'Error al crear evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar un evento
  const updateEvent = useCallback(async (eventId, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await apiPut(`/event/${eventId}`, eventData, true);
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      const errorMessage = error.message || 'Error al actualizar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar un evento
  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/event/${eventId}`, true);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      return true;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      const errorMessage = error.message || 'Error al eliminar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar eventos por ubicación
  const searchEventsByLocation = useCallback(async (locationId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/event', false, { location_id: locationId });
      setEvents(data);
      return data;
    } catch (error) {
      console.error('Error al buscar eventos por ubicación:', error);
      const errorMessage = error.message || 'Error al buscar eventos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    events,
    loading,
    error,
    clearError,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    searchEventsByLocation
  }), [events, loading, error, clearError, fetchEvents, fetchEvent, createEvent, updateEvent, deleteEvent, searchEventsByLocation]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents debe ser usado dentro de EventProvider');
  return ctx;
}
