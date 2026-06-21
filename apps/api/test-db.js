const { Client } = require('pg');
const client = new Client({
  host: 'ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_MQvRIeE8u1NP',
  database: 'neondb',
  ssl: { rejectUnauthorized: false },
});
client.connect()
  .then(() => { console.log('Connected!'); client.end(); })
  .catch(e => console.error('Connection error', e));
