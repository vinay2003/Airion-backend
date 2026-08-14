import fetch from 'node-fetch';
async function run() {
  const res = await fetch('http://localhost:3000/api/services?vendorId=37e8bffd-b27c-4325-b71c-2ac678c0c826');
  if (!res.ok) {
    console.error('Failed to fetch:', res.status, res.statusText);
    const text = await res.text();
    console.error('Response body:', text.substring(0, 500));
    return;
  }
  const data = await res.json();
  data.forEach(s => {
    console.log(`Service: ${s.title}`);
    console.log(`  images:`, s.images);
    if (s.packages) {
      s.packages.forEach(p => {
        console.log(`  Package: ${p.name}`);
      });
    }
  });
}
run();
