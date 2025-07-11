import EventRepository from '../Repositorios/event-repository.js';

export default class EventService {
  getAllAsync = async (query) => {
    const repo = new EventRepository();
    const { name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page = 1, limit = 10 } = query;
    const events = await repo.getAllAsync({ name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page, limit });
    return events;
  };
}


