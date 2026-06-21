const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_MQvRIeE8u1NP@ep-bitter-bar-ahyodkz1-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect()
  .then(() => { console.log('Connected 2!'); client.end(); })
  .catch(e => console.error('Connection error 2', e));
