import * as firebase from "firebase";
import axios from "axios";
import { openSnackbar } from "../Components/CustomSnackbar";
import {
  MESSAGE_SENT_SUCCESSFULLY,
  MESSAGE_SENT_FAILED,
  SNACKBAR_TIMEOUT,
  OFFLINE_TOGGLE_MESSAGE,
  CHAT_COLOR_CHANGED
} from "../AppConstants";
import LoginContext from "../Contexts/LoginContext";
import { useContext } from "react";
import { format } from "util";
import { async } from "q";
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
  // var goOffline = userDetails.goOffline;
  getDb()
    .collection("users")
    .doc(uid)
    .get()
    .then(res => {
      getDb()
        .collection("users")
        .doc(uid)
        .get()
        .then(docSnapshot => {
          var data = docSnapshot.data();
          firebase
            .database()
            .ref(".info/connected")
            .on("value", function(snapshot) {
              // If we're not currently connected, don't do anything.

              if (snapshot.val() == false) {
                setOffline(uid);
                return 0;
              }
              //if we are connected
              if (data && !data.goOffline) {
                // if gooOffline is true user has went offline and we
                // shouldnt show or turn him online
                attachObserverOnConnected(uid);
              }
            });
        });
    });
}

export const attachObserverOnConnected = uid => {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  userStatusDatabaseRef
    .onDisconnect()
    .set(isOfflineForDatabase)
    .then(() => {
      //is offline
      // setFireStoreOfflineOnline(uid, isOfflineForDatabase);
      userStatusDatabaseRef.set(isOnlineForDatabase).then(() => {
        // setFireStoreOfflineOnline(uid, isOnlineForDatabase);
      });
    });
};
//sets offline
export const setOffline = uid => {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  userStatusDatabaseRef.set(isOfflineForDatabase);
};
//sets online
export const setOnline = uid => {
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);
  userStatusDatabaseRef.set(isOnlineForDatabase);
};

//sets online status in firestore
export const setFireStoreOfflineOnline = (uid, onlineState) => {
  if (uid) {
    getDb()
      .collection("users")
      .doc(uid)
      .set(onlineState, { merge: true })
      .then(res => {})
      .catch(err => {
        console.error(err);
      });
  }
};
//toggle show Offline and Online
export const toggleOffline = (isSwitchedOn, uid) => {
  if (uid) {
    getDb()
      .collection("users")
      .doc(uid)
      .update({ goOffline: isSwitchedOn })
      .then(res => {
        if (isSwitchedOn) {
          setOffline(uid);
        } else {
          // setOnline(uid);
          attachObserverOnConnected(uid);
        }
        openSnackbar({
          message: format(
            OFFLINE_TOGGLE_MESSAGE,
            isSwitchedOn ? "offline" : "online"
          ),
          timeout: SNACKBAR_TIMEOUT
        });
      });
  }
};

//sets on backend color
export const setColorBackend = (color, uid) => {
  if (uid)
    getDb()
      .collection("users")
      .doc(uid)
      .update({ color: color })
      .then(res => {
        openSnackbar({
          message: CHAT_COLOR_CHANGED,
          timeout: SNACKBAR_TIMEOUT
        });
      });
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
