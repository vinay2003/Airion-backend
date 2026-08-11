const crypto = require('crypto');
function base64url(str) { return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }
const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({ id: 'admin-bypass', email: 'admin@ease2event.com', role: 'ADMIN', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 31536000 }));
const secret = '1ae64e6a399d2f3a17189530ba954ce647ef2c26bc617a5e9ec8241050a70193895903e481b1bc5b1609ef5ead15c56110c49be64d7e1fbc4b706a353199d9db';
const signature = base64url(crypto.createHmac('sha256', secret).update(header + '.' + payload).digest());
console.log(header + '.' + payload + '.' + signature);
