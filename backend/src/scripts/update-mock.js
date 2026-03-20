const fs = require('fs');
const path = require('path');

const filePath = '/Users/vinaysharma/Desktop/airion/frontend/user-website/src/lib/api.ts';
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/\{ id: '(\d+)',/g, "{ id: '$1', vendorId: '1a0083b6-10a0-45c8-b4b2-42f12f5c0c40',");

fs.writeFileSync(filePath, content, 'utf-8');
console.log("✅ Updated MOCK_EVENTS with vendorId!");
