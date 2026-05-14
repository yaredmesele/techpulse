import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Test connection as required by instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Auto sign-in anonymously to allow counter updates
// Note: This requires Anonymous Auth to be enabled in the Firebase Console.
// If it's disabled, the app will fallback to unauthenticated writes (permitted for blog_stats).
signInAnonymously(auth).catch(err => {
  if (err.code === 'auth/admin-restricted-operation') {
    console.warn("Anonymous auth disabled in Firebase Console. Using unauthenticated fallback for stats.");
  } else {
    console.error("Firebase auth error:", err);
  }
});
