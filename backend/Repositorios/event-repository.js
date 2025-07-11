import DBConfig from '../DBConfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class EventRepository {
  getAllAsync = async ({id, name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, page, limit}) => {
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
        WHERE 1=1

      `;
      const params = [];
      if (id) {
        sql += ` AND events.id = $${params.length + 1}`;
        params.push(id);
      }
      if (name) {
        sql += ` AND events.name ILIKE $${params.length + 1}`;
        params.push(`%${name}%`);
      }
      if (start_date) {
        console.log('startdate recibido:', start_date);
        sql += ` AND events.start_date <= $${params.length + 1}`;
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

  getByIdAsync = async (id) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();

      // Consulta evento + ubicación + localidad + provincia + usuario creador (evento y lugar)
      const eventQuery = `
        SELECT
          e.id,
          e.name,
          e.description,
          e.id_event_location,
          e.start_date,
          e.duration_in_minutes,
          e.price,
          e.enabled_for_enrollment,
          e.max_assistance,
          e.id_creator_user,

          el.id AS event_location_id,
          el.id_location,
          el.name AS event_location_name,
          el.full_address,
          el.max_capacity,
          el.latitude AS event_location_latitude,
          el.longitude AS event_location_longitude,
          el.id_creator_user AS event_location_creator_user_id,

          l.id AS location_id,
          l.name AS location_name,
          l.id_province,
          l.latitude AS location_latitude,
          l.longitude AS location_longitude,

          p.id AS province_id,
          p.name AS province_name,
          p.full_name AS province_full_name,
          p.latitude AS province_latitude,
          p.longitude AS province_longitude,

          el_creator.id AS el_creator_id,
          el_creator.first_name AS el_creator_first_name,
          el_creator.last_name AS el_creator_last_name,
          el_creator.username AS el_creator_username,

          e_creator.id AS e_creator_id,
          e_creator.first_name AS e_creator_first_name,
          e_creator.last_name AS e_creator_last_name,
          e_creator.username AS e_creator_username

        FROM events e
        INNER JOIN event_locations el ON e.id_event_location = el.id
        INNER JOIN locations l ON el.id_location = l.id
        INNER JOIN provinces p ON l.id_province = p.id
        INNER JOIN users el_creator ON el.id_creator_user = el_creator.id
        INNER JOIN users e_creator ON e.id_creator_user = e_creator.id
        WHERE e.id = $1
      `;

      const eventResult = await client.query(eventQuery, [id]);
      if (eventResult.rowCount === 0) {
        return null;
      }
      const event = eventResult.rows[0];

      // Consulta tags relacionados
      const tagsQuery = `
        SELECT t.id, t.name
        FROM tags t
        INNER JOIN event_tags et ON t.id = et.id_tag
        WHERE et.id_event = $1
      `;
      const tagsResult = await client.query(tagsQuery, [id]);

      return { event, tags: tagsResult.rows };

    } catch (error) {
      throw error;
    } finally {
      await client.end();
    }
  };
}
