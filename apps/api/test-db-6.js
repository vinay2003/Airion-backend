const { Client } = require('pg');
const client = new Client({
  host: 'ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  user: 'endpoint=ep-aged-frost-aif42cf4;neondb_owner',
  password: 'npg_UHIlwOxX0a2T',
  database: 'neondb',
  ssl: { rejectUnauthorized: false },
});
client.connect()
  .then(() => { console.log('Connected 6!'); client.end(); })
  .catch(e => console.error('Connection error 6', e));
