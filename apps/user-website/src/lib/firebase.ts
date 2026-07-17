import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';


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

// Production Firebase config (used when env vars are not injected — e.g. monorepo Vercel builds)
// Note: Firebase web API keys are NOT secret — they are always visible in the browser bundle.
// Security is enforced via Firebase Security Rules and authorized domains.
const FIREBASE_PROD_CONFIG = {
  apiKey: "AIzaSyAigoCAh80p9Qey4JfpDpztAj8RLjCB8mQ",
  authDomain: "easy2event-67c2a.firebaseapp.com",
  projectId: "easy2event-67c2a",
  storageBucket: "easy2event-67c2a.firebasestorage.app",
  messagingSenderId: "742753803631",
  appId: "1:742753803631:web:531861dffbdf90e44c5c9a"
};

// Vite environments retrieve config properties via import.meta.env.VITE_ prefix
const firebaseConfig = {
  apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY) || FIREBASE_PROD_CONFIG.apiKey,
  authDomain: cleanEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || FIREBASE_PROD_CONFIG.authDomain,
  projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID) || FIREBASE_PROD_CONFIG.projectId,
  storageBucket: cleanEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || FIREBASE_PROD_CONFIG.storageBucket,
  messagingSenderId: cleanEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || FIREBASE_PROD_CONFIG.messagingSenderId,
  appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID) || FIREBASE_PROD_CONFIG.appId
};

// Always configured now — prod values are hardcoded as fallback
const isConfigured = true;

if (import.meta.env.DEV) {
  console.log('🔥 [Firebase Client] Credentials configured:', {
    projectId: firebaseConfig.projectId,
    apiKeyMasked: `${firebaseConfig.apiKey.substring(0, 6)}...`,
    authDomain: firebaseConfig.authDomain,
    source: import.meta.env.VITE_FIREBASE_API_KEY ? 'env vars' : 'hardcoded fallback'
  });
}

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Enable reCAPTCHA verification bypass for local testing in development mode if configured
if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_BYPASS_RECAPTCHA === 'true') {
  auth.settings.appVerificationDisabledForTesting = true;
  console.log('🔒 [Firebase Client] Bypassing reCAPTCHA verification for local development (Test Numbers only).');
} else if (import.meta.env.DEV) {
  console.log('📱 [Firebase Client] Live reCAPTCHA verification active (Real Phone Numbers).');
}


export const isFirebaseConfigured = isConfigured;
export { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber };

