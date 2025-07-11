import EventRepository from '../Repositorios/event-repository.js';

export default class EventService {
  getAllAsync = async (query) => {
    const repo = new EventRepository();
    const { name, startdate, tag, page = 1, limit = 10 } = query;
    const events = await repo.getAllAsync({ name, startdate, tag, page, limit });
    return events;
  };
}
