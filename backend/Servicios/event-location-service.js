// Servicios/event-location-service.js
import EventLocationRepository from '../Repositorios/event-location-repository.js';

export default class EventLocationService {
  constructor() {
    this.repo = new EventLocationRepository();
  }

  async getAll(userId) {
    return await this.repo.getAllByUser(userId);
  }

  async getById(id, userId) {
    const location = await this.repo.getById(id);
    if (!location || location.id_creator_user !== userId) return null;
    return location;
  }
}
