const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_UHIlwOxX0a2T@ep-aged-frost-aif42cf4-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
});
client.connect()
  .then(() => {
    return client.query('DELETE FROM vendor_gallery WHERE vendor_id IS NULL;');
  })
  .then((res) => {
    console.log(`Deleted ${res.rowCount} rows from vendor_gallery with NULL vendor_id.`);
    return client.query('DELETE FROM vendor_gallery;');
  })
  .then((res) => {
    console.log(`Deleted ${res.rowCount} rows from vendor_gallery completely (fallback).`);
    client.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    client.end();
  });
