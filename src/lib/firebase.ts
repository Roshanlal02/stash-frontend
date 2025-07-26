import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check that all required environment variables are set
const allConfigSet = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

if (allConfigSet) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  // Provide mock objects to prevent app crashes during development if keys are missing
  app = {} as FirebaseApp;
  auth = {} as Auth;
  googleProvider = {} as any;
}


export { app, auth, googleProvider };
