import DBConfig from "../DBConfig.js";
import pkg from "pg";
const { Client } = pkg;

export default class EventRepository {
  getAllAsync = async ({
    id,
    name,
    description,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user,
    page,
    limit,
  }) => {
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
        console.log("startdate recibido:", start_date);
        sql += ` AND events.start_date <= $${params.length + 1}`;
        params.push(start_date);
      }

      sql += ` ORDER BY events.start_date ASC LIMIT $${
        params.length + 1
      } OFFSET $${params.length + 2}`;
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
      el.full_adress,
      el.max_capacity,
      el.latitude AS event_location_latitude,
      el.longitude AS event_location_longitude,
    
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
    
      e_creator.id AS e_creator_id,
      e_creator.first_name AS e_creator_first_name,
      e_creator.last_name AS e_creator_last_name,
      e_creator.username AS e_creator_username
    FROM events e
    INNER JOIN event_locations el ON e.id_event_location = el.id
    INNER JOIN locations l ON el.id_location = l.id
    INNER JOIN provinces p ON l.id_province = p.id
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
        INNER JOIN event_tags et ON t.id = et.tag_id
        WHERE et.event_id = $1
      `;

      const tagsResult = await client.query(tagsQuery, [id]);

      return { event, tags: tagsResult.rows };
    } catch (error) {
      throw error;
    } finally {
      await client.end();
    }
  };

  insertAsync = async (event) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const sql = `
        INSERT INTO events (name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *;
      `;
      const values = [
        event.name,
        event.description,
        event.id_event_location,
        event.start_date,
        event.duration_in_minutes,
        event.price,
        event.enabled_for_enrollment,
        event.max_assistance,
        event.id_creator_user,
      ];
      const result = await client.query(sql, values);
      return result.rows[0];
    } finally {
      await client.end();
    }
  };

  updateAsync = async (event) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const sql = `
        UPDATE events
        SET name=$1, description=$2, id_event_location=$3, start_date=$4, duration_in_minutes=$5, price=$6, enabled_for_enrollment=$7, max_assistance=$8
        WHERE id=$9
        RETURNING *;
      `;
      const values = [
        event.name,
        event.description,
        event.id_event_location,
        event.start_date,
        event.duration_in_minutes,
        event.price,
        event.enabled_for_enrollment,
        event.max_assistance,
        event.id,
      ];
      const result = await client.query(sql, values);
      return result.rows[0];
    } finally {
      await client.end();
    }
  };

  deleteAsync = async (id) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      await client.query(`DELETE FROM events WHERE id = $1`, [id]);
    } finally {
      await client.end();
    }
  };

  hasRegistrations = async (id_event) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const result = await client.query(`SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1`, [id_event]);
      return parseInt(result.rows[0].count) > 0;
    } finally {
      await client.end();
    }
  };  

  // Contar inscripciones para un evento
countEnrollments = async (eventId) => {
  const client = new Client(DBConfig);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1`, 
      [eventId]
    );
    return parseInt(res.rows[0].count);
  } finally {
    await client.end();
  }
};

// Verificar si un usuario está registrado en un evento
isUserRegistered = async (eventId, userId) => {
  const client = new Client(DBConfig);
  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM event_enrollments WHERE id_event = $1 AND id_user = $2 LIMIT 1`,
      [eventId, userId]
    );
    return res.rowCount > 0;
  } finally {
    await client.end();
  }
};

// Insertar inscripción
insertEnrollment = async (eventId, userId) => {
  const client = new Client(DBConfig);
  try {
    await client.connect();
    const now = new Date();
    await client.query(
      `INSERT INTO event_enrollments (id_event, id_user, registration_date_time) VALUES ($1, $2, $3)`,
      [eventId, userId, now]
    );
  } finally {
    await client.end();
  }
};

// Eliminar inscripción
deleteEnrollment = async (eventId, userId) => {
  const client = new Client(DBConfig);
  try {
    await client.connect();
    await client.query(
      `DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2`,
      [eventId, userId]
    );
  } finally {
    await client.end();
  }
};

}
