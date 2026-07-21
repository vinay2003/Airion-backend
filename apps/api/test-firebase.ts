import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config({ path: '.env.development' });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log("Project ID:", projectId);
console.log("Client Email:", clientEmail);

let formattedPrivateKey = privateKey || '';
if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1);
} else if (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'")) {
    formattedPrivateKey = formattedPrivateKey.slice(1, -1);
}

formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'").trim();

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
        }),
    });
    console.log("Success! Apps:", admin.apps.length);
} catch (err: any) {
    console.error("Initialization error:", err.message);
}
