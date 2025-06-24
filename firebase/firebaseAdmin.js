import admin from "firebase-admin";
import serviceAccount from "../shuttlemate-9bedd-firebase-adminsdk-e9fzv-95de2b73ef.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
