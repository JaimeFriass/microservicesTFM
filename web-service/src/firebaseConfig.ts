import * as firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "xxx",
  authDomain: "xx",
  databaseURL: "xx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
});

export default app;

export const getTemperatures = (userId: string) => {
  return new Promise((resolve, reject) => {
    app
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("temperature")
      .orderBy("timestamp", "asc")
      .get()
      .then((querySnapshot: any) => {
        const temperatures: any[] = querySnapshot.docs.map((doc: any) => ({
          value: doc.data().temperature,
          date: doc.data().timestamp.toDate(),
          key: doc.id,
        }));

        resolve(temperatures);
      })
      .catch((e: any) => {
        reject(e);
      });
  });
};
