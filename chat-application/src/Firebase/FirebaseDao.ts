import * as firebase from "firebase";
import axios from "axios";
import { openSnackbar } from "../Components/CustomSnackbar";
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
export function getAuth() {
  return firebase.auth();
}
var isOfflineForDatabase = {
  state: "offline",
  last_changed: firebase.database.ServerValue.TIMESTAMP
};

var isOnlineForDatabase = {
  state: "online",
  last_changed: firebase.database.ServerValue.TIMESTAMP
};
export function getConnectionStatus(uid) {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  firebase
    .database()
    .ref(".info/connected")
    .on("value", function(snapshot) {
      // If we're not currently connected, don't do anything.
      if (snapshot.val() == false) {
        return 0;
      }
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(function() {
          userStatusDatabaseRef.set(isOnlineForDatabase).then(() => {
            return 1;
          });
        });
    });
}
export const setOffline = uid => {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  userStatusDatabaseRef.set(isOfflineForDatabase);
};

export const postMessage = (message, username) => {
  var date = new Date();
  var time = date.getTime();
  getDb()
    .collection("chats")
    .doc(time.toString())
    .set({ message: message, name: username, timeStamp: time })
    .then(() => {
      openSnackbar({ message: "Message Sent Successfully", timeout: 3000 });
    })
    .catch(() => {
      openSnackbar({ message: "Failed to Sent Message", timeout: 3000 });
    });
};
