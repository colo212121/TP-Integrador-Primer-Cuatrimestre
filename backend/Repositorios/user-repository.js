import DBConfig from '../DBConfig.js';
import pkg from 'pg';
const { Client } = pkg;

export default class UserRepository {
  
  findByUsername = async (username) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      return res.rows[0];
    } catch (error) {
      throw error;
    } finally {
      await client.end();
    }
  };

  createUser = async ({ first_name, last_name, username, password }) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const res = await client.query(
        `INSERT INTO users (first_name, last_name, username, password)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [first_name, last_name, username, password]
      );
      return res.rows[0];
    } catch (error) {
      throw error;
    } finally {
      await client.end();
    }
  };

}
