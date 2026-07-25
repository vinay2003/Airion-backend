const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

// Fix the corrupted `\\Y` back to `\nY`
privateKey = privateKey.replace(/\\\\Y/g, '\\nY');

console.log("Found private key length:", privateKey ? privateKey.length : 0);

try {
    let formattedPrivateKey = privateKey;
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
    
    if (!formattedPrivateKey.includes('\n')) {
        formattedPrivateKey = formattedPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n');
        formattedPrivateKey = formattedPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
        }),
    });
    console.log('Firebase initialized successfully!');
} catch (err) {
    console.error('Firebase initialization failed:', err.message);
}
