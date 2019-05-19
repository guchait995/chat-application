import * as firebase from "firebase";
import axios from "axios";
import { openSnackbar } from "../Components/CustomSnackbar";
import {
  MESSAGE_SENT_SUCCESSFULLY,
  MESSAGE_SENT_FAILED,
  SNACKBAR_TIMEOUT
} from "../AppConstants";
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

//if user name already registered
export async function isUserExist(username) {
  console.log(username);
  var doc = await getDb()
    .collection("usernames")
    .doc(username)
    .get();
  if (doc.data() != null) {
    return true;
  }
  return false;
}

//returns get connection status by uid
export function getConnectionStatus(uid) {
  if (uid) {
    getDb()
      .collection("users")
      .doc(uid)
      .get()
      .then(res => {
        var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
        firebase
          .database()
          .ref(".info/connected")
          .on("value", function(snapshot) {
            // If we're not currently connected, don't do anything.
            if (snapshot.val() == false) {
              return 0;
            }
            //if we are connected
            userStatusDatabaseRef
              .onDisconnect()
              .set(isOfflineForDatabase)
              .then(function() {
                userStatusDatabaseRef.set(isOnlineForDatabase).then(() => {
                  return 1;
                });
              });
          });
      });
  }
}

//setsonline offline state change
export const onOnlineOfflineStateChange = (uid, state) => {
  var timeStamp = new Date().getTime();
  getDb()
    .collection("users")
    .doc(uid)
    .set({ state: state, last_changed: timeStamp }, { merge: true });
};
//sets offline
export const setOffline = uid => {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  userStatusDatabaseRef.set(isOfflineForDatabase);
};

//post messages to chat
export const postMessage = (message, username, color) => {
  var date = new Date();
  var time = date.getTime();
  getDb()
    .collection("chats")
    .doc(time.toString())
    .set({ message: message, name: username, timeStamp: time, color: color })
    .then(() => {
      openSnackbar({
        message: MESSAGE_SENT_SUCCESSFULLY,
        timeout: SNACKBAR_TIMEOUT
      });
    })
    .catch(() => {
      openSnackbar({ message: MESSAGE_SENT_FAILED, timeout: SNACKBAR_TIMEOUT });
    });
};
