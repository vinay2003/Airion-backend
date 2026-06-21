const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect()
  .then(() => { console.log('Connected 4!'); client.end(); })
  .catch(e => console.error('Connection error 4', e));
