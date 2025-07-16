// Repositorios/event-location-repository.js
import DBConfig from '../DBConfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventLocationRepository {
    async getAllByUser(userId) {
        const client = new Client(DBConfig);
        try {
          await client.connect();
          const sql = `
            SELECT el.*
            FROM event_locations el
            INNER JOIN events e ON e.id_event_location = el.id
            WHERE e.id_creator_user = $1
          `;
          const result = await client.query(sql, [userId]);
          return result.rows;
        } finally {
          await client.end();
        }
      }
      

  async getById(id) {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const sql = `SELECT * FROM event_locations WHERE id = $1`;
      const result = await client.query(sql, [id]);
      return result.rowCount > 0 ? result.rows[0] : null;
    } finally {
      await client.end();
    }
  }
}
