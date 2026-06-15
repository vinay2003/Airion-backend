import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


// Helper to clean environment variables (stripping surrounding quotes if loaded literally)
const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return '';
  let clean = val.trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.substring(1, clean.length - 1);
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.substring(1, clean.length - 1);
  }
  return clean;
};

// Vite environments retrieve config properties via import.meta.env.VITE_ prefix
const firebaseConfig = {
  apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID)
};

// Graceful check for config presence to avoid runtime load crashes
const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (import.meta.env.DEV) {
  if (isConfigured) {
    console.log('🔥 [Firebase Vendor Client] Credentials configured successfully:', {
      projectId: firebaseConfig.projectId,
      apiKeyMasked: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 6)}...` : 'none',
      authDomain: firebaseConfig.authDomain
    });
  } else {
    console.warn(
      '⚠️ [Airion Vendor] Firebase client-side credentials are not fully configured in your .env file.\n' +
      'Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc. in .env.development to enable live SMS OTP.'
    );
  }
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

// Enable reCAPTCHA verification bypass for local testing in development mode if configured
if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_BYPASS_RECAPTCHA === 'true') {
  auth.settings.appVerificationDisabledForTesting = true;
  console.log('🔒 [Firebase Vendor Client] Bypassing reCAPTCHA verification for local development (Test Numbers only).');
} else if (import.meta.env.DEV) {
  console.log('📱 [Firebase Vendor Client] Live reCAPTCHA verification active (Real Phone Numbers).');
}


export const isFirebaseConfigured = isConfigured;

