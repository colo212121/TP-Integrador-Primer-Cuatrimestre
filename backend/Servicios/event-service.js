// event-service.js
import EventRepository from '../Repositorios/event-repository.js';
import EventLocationRepository from '../Repositorios/event-location-repository.js';
import moment from 'moment';

export default class EventService {
  getAllAsync = async (query) => {
    const repo = new EventRepository();
    const { id, name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page = 1, limit = 10 } = query;
    return await repo.getAllAsync({ id, name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page, limit });
  };

  getByIdAsync = async (id) => {
    const repo = new EventRepository();
    const data = await repo.getByIdAsync(id);
    if (!data) return null;
  
    const e = data.event;
  
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      id_event_location: e.id_event_location,
      start_date: e.start_date,
      duration_in_minutes: e.duration_in_minutes,
      price: e.price,
      enabled_for_enrollment: e.enabled_for_enrollment,
      max_assistance: e.max_assistance,
      id_creator_user: e.id_creator_user,
  
      event_location: {
        id: e.event_location_id,
        id_location: e.id_location,
        name: e.event_location_name,
        full_address: e.full_adress,   // corregí aquí si tu columna es 'full_address' o 'full_adress'
        max_capacity: e.max_capacity,
        latitude: e.event_location_latitude,
        longitude: e.event_location_longitude,
        creator_user: {
          id: e.e_creator_id,              // en tu consulta es 'e_creator' el alias?
          first_name: e.e_creator_first_name,
          last_name: e.e_creator_last_name,
          username: e.e_creator_username,
          password: "******"
        },
        location: {
          id: e.location_id,
          name: e.location_name,
          id_province: e.id_province,
          latitude: e.location_latitude,
          longitude: e.location_longitude,
          province: {
            id: e.province_id,
            name: e.province_name,
            full_name: e.province_full_name,
            latitude: e.province_latitude,
            longitude: e.province_longitude,
            display_order: null,
          }
        }
      },
  
      tags: data.tags || [],
  
      creator_user: {
        id: e.id_creator_user,
        first_name: e.e_creator_first_name,
        last_name: e.e_creator_last_name,
        username: e.e_creator_username,
        password: "******"
      }
    };
  };
  

  createEvent = async (event, userId) => {
    const { name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance } = event;
    if (!name || name.length < 3 || !description || description.length < 3)
      return { status: 400, success: false, message: "Nombre o descripción inválida." };

    if (duration_in_minutes < 0 || price < 0)
      return { status: 400, success: false, message: "Duración o precio no pueden ser negativos." };

    const locationRepo = new EventLocationRepository();
    const location = await locationRepo.getById(id_event_location);
    if (!location) return { status: 400, success: false, message: "Ubicación no encontrada." };

    if (max_assistance > location.max_capacity)
      return { status: 400, success: false, message: "La asistencia máxima supera la capacidad de la ubicación." };

    const repo = new EventRepository();
    const newEvent = await repo.insertAsync({ ...event, id_creator_user: userId });
    return { status: 201, success: true, data: newEvent };
  };

  updateEvent = async (event, userId) => {
    const repo = new EventRepository();
    const existingEvent = await repo.getByIdAsync(event.id);
    if (!existingEvent) return { status: 404, success: false, message: "Evento no encontrado." };
    if (existingEvent.event.id_creator_user !== userId)
      return { status: 404, success: false, message: "No tienes permisos para editar este evento." };

    return await this.createEvent(event, userId)
      .then(({ status, message }) => {
        if (status !== 201) return { status, success: false, message };
        return repo.updateAsync(event)
          .then(data => ({ status: 200, success: true, data }))
          .catch(() => ({ status: 500, success: false, message: "Error al actualizar el evento." }));
      });
  };

  deleteEvent = async (eventId, userId) => {
    const repo = new EventRepository();
    const event = await repo.getByIdAsync(eventId);
    if (!event) return { status: 404, success: false, message: "Evento no encontrado." };
    if (event.event.id_creator_user !== userId)
      return { status: 404, success: false, message: "No tienes permisos para eliminar este evento." };

    const isUserRegistered = await repo.hasRegistrations(eventId);
    if (isUserRegistered)
      return { status: 400, success: false, message: "Hay usuarios registrados en el evento." };

    await repo.deleteAsync(eventId);
    return { status: 200, success: true, message: "Evento eliminado con éxito." };
  };

  enrollUser = async (eventId, userId) => {
    const repo = new EventRepository();

    // 1. Verificar que exista el evento
    const eventData = await repo.getByIdAsync(eventId);
    if (!eventData) return { status: 404, success: false, message: 'Evento no encontrado.' };

    const event = eventData.event;

    // 2. Verificar que el evento esté habilitado para inscripción
    if (!event.enabled_for_enrollment) {
      return { status: 400, success: false, message: 'Evento no habilitado para inscripción.' };
    }

    // 3. Verificar que el evento no haya ocurrido o sea hoy
    const now = new Date();
    const eventDate = new Date(event.start_date);
    if (eventDate <= now.setHours(23, 59, 59, 999)) { 
      return { status: 400, success: false, message: 'No se puede inscribir a un evento pasado o del día de hoy.' };
    }

    // 4. Verificar capacidad máxima
    const registrationsCount = await repo.countEnrollments(eventId);
    if (registrationsCount >= event.max_assistance) {
      return { status: 400, success: false, message: 'Se alcanzó la capacidad máxima de inscritos.' };
    }

    // 5. Verificar que el usuario no esté ya registrado
    const alreadyRegistered = await repo.isUserRegistered(eventId, userId);
    if (alreadyRegistered) {
      return { status: 400, success: false, message: 'Usuario ya registrado en este evento.' };
    }

    // 6. Insertar la inscripción con la fecha y hora actual
    await repo.insertEnrollment(eventId, userId);

    return { status: 201, success: true, message: 'Inscripción realizada con éxito.' };
  };

  removeEnrollment = async (eventId, userId) => {
    const repo = new EventRepository();

    // 1. Verificar que exista el evento
    const eventData = await repo.getByIdAsync(eventId);
    if (!eventData) return { status: 404, success: false, message: 'Evento no encontrado.' };

    const event = eventData.event;

    // 2. Verificar que el evento no haya ocurrido o sea hoy
    const now = new Date();
    const eventDate = new Date(event.start_date);
    if (eventDate <= now.setHours(23, 59, 59, 999)) {
      return { status: 400, success: false, message: 'No se puede remover inscripción de un evento pasado o del día de hoy.' };
    }

    // 3. Verificar que el usuario esté registrado
    const isRegistered = await repo.isUserRegistered(eventId, userId);
    if (!isRegistered) {
      return { status: 400, success: false, message: 'Usuario no está registrado en este evento.' };
    }

    // 4. Eliminar inscripción
    await repo.deleteEnrollment(eventId, userId);

    return { status: 200, success: true, message: 'Inscripción eliminada con éxito.' };
  };

}
