import EventRepository from '../Repositorios/event-repository.js';

export default class EventService {
  getAllAsync = async (query) => {
    const repo = new EventRepository();
    const { id, name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page = 1, limit = 10 } = query;
    const events = await repo.getAllAsync({ id, name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page, limit });
    return events;
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
        full_address: e.full_address,
        max_capacity: e.max_capacity,
        latitude: e.event_location_latitude,
        longitude: e.event_location_longitude,
        id_creator_user: e.event_location_creator_user_id,
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
        },
        creator_user: {
          id: e.el_creator_id,
          first_name: e.el_creator_first_name,
          last_name: e.el_creator_last_name,
          username: e.el_creator_username,
          password: '******',
        }
      },

      tags: data.tags,

      creator_user: {
        id: e.e_creator_id,
        first_name: e.e_creator_first_name,
        last_name: e.e_creator_last_name,
        username: e.e_creator_username,
        password: '******',
      }
    };
  };
}


