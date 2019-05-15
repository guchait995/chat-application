import * as firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCczyYTfWTySspf_s6Dne_ncxW5mr70s_w",
  authDomain: "chat-application-4596f.firebaseapp.com",
  databaseURL: "https://chat-application-4596f.firebaseio.com",
  projectId: "chat-application-4596f",
  storageBucket: "chat-application-4596f.appspot.com",
  messagingSenderId: "876542603927",
  appId: "1:876542603927:web:1e8f54d804b16811"
};
firebase.initializeApp(firebaseConfig);

export function getDb() {
  return firebase.firestore();
}
