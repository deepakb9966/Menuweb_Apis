
import * as admin from "firebase-admin";
// import {initializeApp} from "firebase-admin/app";
import * as serviceAccount from "./key.json";
// console.log(serviceAccount);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
	storageBucket: `${serviceAccount.project_id}.appspot.com`,
});

const db = admin.firestore();

export { admin, db };
