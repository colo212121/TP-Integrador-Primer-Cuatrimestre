import DBConfig from '../DBConfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
  getAllAsync = async ({name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page, limit}) => {
    let events = [];
    const client = new Client(DBConfig);
    const offset = (page - 1) * limit;

    try {
      await client.connect();
      let sql = `
        SELECT events.name, events.description, event_locations.full_adress, users.first_name, users.last_name, events.start_date, events.duration_in_minutes, events.price, events.enabled_for_enrollment, events.max_assistance
        FROM events
        INNER JOIN event_locations ON events.id_event_location = event_locations.id
        INNER JOIN users ON events.id_creator_user = users.id

      `;
      const params = [];
      if (name) {
        sql += ` AND events.name ILIKE $${params.length + 1}`;
        params.push(`%${name}%`);
      }
      if (start_date) {
        sql += ` AND events.start_date >= $${params.length + 1}`;
        params.push(start_date);
      }

      sql += ` ORDER BY events.start_date ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await client.query(sql, params);
      events = result.rows;
    } catch (err) {
      console.log(err);
    } finally {
      await client.end();
    }

    return events;
  };
}
