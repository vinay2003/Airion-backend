const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect()
  .then(() => {
    return client.query('TRUNCATE TABLE vendor_gallery CASCADE;');
  })
  .then((res) => {
    console.log(`Successfully truncated vendor_gallery.`);
    client.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    client.end();
  });
