/**
 * Family phones share this project. Analytics is not used — it only works on web.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyBJze_2BoI_H7_2JijXIwRTKRbLPW5yO5Y',
  authDomain: 'familybank-c4240.firebaseapp.com',
  databaseURL: 'https://familybank-c4240-default-rtdb.firebaseio.com',
  projectId: 'familybank-c4240',
  storageBucket: 'familybank-c4240.firebasestorage.app',
  messagingSenderId: '229422191912',
  appId: '1:229422191912:web:2a16e87f45465dd486ec1d',
  measurementId: 'G-Z7LT3SVWN8',
};

export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.databaseURL.startsWith('https://') &&
    firebaseConfig.apiKey.length > 8
  );
}
