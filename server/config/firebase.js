import admin from 'firebase-admin'
import fs from 'fs';
// const serviceAccount = JSON.parse(
//   fs.readFileSync(new URL('../serviceAccount.json', import.meta.url))
// );

const firebaseConfig = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
};


if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
  console.error("❌ Critical: Missing Firebase Environment Variables!");
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

export default admin;