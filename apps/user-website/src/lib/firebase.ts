import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Vite environments retrieve config properties via import.meta.env.VITE_ prefix
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Graceful check for config presence to avoid runtime load crashes
const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (!isConfigured && import.meta.env.DEV) {
  console.warn(
    '⚠️ [Ease2Event] Firebase client-side credentials are not fully configured in your .env file.\n' +
    'Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc. in your .env.local or .env.development to enable live SMS OTP.'
  );
}

// Initialize Firebase App instance
const app = initializeApp(
  isConfigured 
    ? firebaseConfig 
    : {
        apiKey: "placeholder-api-key",
        authDomain: "placeholder-auth-domain.firebaseapp.com",
        projectId: "placeholder-project-id",
        storageBucket: "placeholder-storage-bucket.appspot.com",
        messagingSenderId: "placeholder-messaging-sender-id",
        appId: "placeholder-app-id"
      }
);

export const auth = getAuth(app);
