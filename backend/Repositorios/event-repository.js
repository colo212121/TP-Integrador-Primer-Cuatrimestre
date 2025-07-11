import DBConfig from '../DBConfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
  getAllAsync = async ({ name, startdate, tag, page, limit }) => {
    let events = [];
    const client = new Client(DBConfig);
    const offset = (page - 1) * limit;

    try {
      await client.connect();
      let sql = `
        SELECT * FROM events e
        LEFT JOIN users u ON e.id_creator_user = u.id
        LEFT JOIN event_locations el ON e.id_event_location = el.id
        LEFT JOIN locations l ON el.id_location = l.id
        LEFT JOIN provinces p ON l.id_province = p.id
        WHERE 1=1
      `;
      const params = [];
      if (name) {
        sql += ` AND e.name ILIKE $${params.length + 1}`;
        params.push(`%${name}%`);
      }
      if (startdate) {
        sql += ` AND e.start_date >= $${params.length + 1}`;
        params.push(startdate);
      }
      if (tag) {
        sql += ` AND EXISTS (
          SELECT 1 FROM event_tag et
          JOIN tags t ON et.id_tag = t.id
          WHERE et.id_event = e.id AND t.name ILIKE $${params.length + 1}
        )`;
        params.push(`%${tag}%`);
      }

      sql += ` ORDER BY e.start_date ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
