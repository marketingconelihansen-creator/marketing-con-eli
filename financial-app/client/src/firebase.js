import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Config pública (es seguro compartir - solo para lectura desde app)
const firebaseConfig = {
  apiKey: "AIzaSyDvX1mH9pQ8kL2nR9sT6uV3wX0yZ1aB2cD",
  authDomain: "libertad-financiera-app.firebaseapp.com",
  databaseURL: "https://libertad-financiera-app-default-rtdb.firebaseio.com",
  projectId: "libertad-financiera-app",
  storageBucket: "libertad-financiera-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl"
};

let app = null;
let db = null;
let auth = null;
let userId = null;

export const initFirebase = async () => {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);

    // Autenticación anónima
    const result = await signInAnonymously(auth);
    userId = result.user.uid;
    console.log('Firebase inicializado:', userId);
    return true;
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
    return false;
  }
};

export const saveDataToFirebase = async (data) => {
  if (!userId || !db) return false;
  try {
    await set(ref(db, `users/${userId}/data`), {
      ...data,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error guardando en Firebase:', error);
    return false;
  }
};

export const loadDataFromFirebase = (callback) => {
  if (!userId || !db) {
    console.log('Firebase no disponible');
    return () => {};
  }

  const dataRef = ref(db, `users/${userId}/data`);

  const unsubscribe = onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Remover lastUpdated antes de pasar al callback
      const { lastUpdated, ...cleanData } = data;
      callback(cleanData);
    }
  }, (error) => {
    console.error('Error leyendo de Firebase:', error);
  });

  return unsubscribe;
};

export const isFirebaseReady = () => !!userId && !!db;
