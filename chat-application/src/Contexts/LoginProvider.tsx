import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginContext from "./LoginContext";
import {
  getAuth,
  getDb,
  setOffline,
  getConnectionStatus
} from "../Firebase/FirebaseDao";
import { userInfo } from "os";
import { openSnackbar } from "../Components/CustomSnackbar";
import {
  LOGIN_EMAIL_NOT_FOUND,
  SNACKBAR_TIMEOUT,
  LOGIN_FAILED_MESSAGE,
  SIGNUP_EMAIL_ALREADY_FOUND,
  USERNAME_COLORS
} from "../AppConstants";
import { getRandomColor } from "../Utilities/Util";
export interface LoginInfo {
  isLoggedIn: boolean | null;
  userDetails?: any | null;
  uid?: string | null;
}

export default function LoginProvider(props) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    isLoggedIn: null,
    userDetails: null,
    uid: null
  });
  var observe: () => void;
  const setLoginDetails = (isLoggedIn, uid, userDetails) => {
    setLoginInfo({
      ...loginInfo,
      isLoggedIn: isLoggedIn,
      uid: uid,
      userDetails: userDetails
    });
  };
  const loginWithEmailAndPwd = async (email, password) => {
    getAuth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {})
      .catch(err => {
        console.log(err);
        if (err.code === "auth/user-not-found")
          openSnackbar({
            message: LOGIN_EMAIL_NOT_FOUND,
            timeout: SNACKBAR_TIMEOUT
          });
        else
          openSnackbar({
            message: LOGIN_FAILED_MESSAGE,
            timeout: SNACKBAR_TIMEOUT
          });
      });
  };
  const logOutUser = async uid => {
    setOffline(uid);
    setLoginDetails(false, uid, null);
    var unsubscribe = getDb()
      .collection("users")
      .doc(uid)
      .onSnapshot(
        documentSnapshot => {
          var doc = documentSnapshot.data();
          if (doc) {
            var state = doc.state;
            console.log(state);
            if (state === "offline") {
              unsubscribe();
              getAuth()
                .signOut()
                .then(res => {});
            } else {
              return false;
            }
          }
          return false;
        },
        err => {
          return false;
        }
      );
  };
  const signUpWithEmailPasswordUsername = (email, password, username) => {
    getAuth()
      .createUserWithEmailAndPassword(email, password)
      .then(firebaseUser => {
        let color = getRandomColor();
        let user = firebaseUser.user;
        console.log(color);
        console.log(user);
        if (user) {
          getDb()
            .collection("usernames")
            .doc(username)
            .set({ email: email })
            .then(value => {
              console.log("created username");
              if (user)
                getDb()
                  .collection("users")
                  .doc(user.uid)
                  .set({
                    email: email,
                    username: username,
                    state: "online",
                    last_changed: 1558097573186,
                    color: color,
                    goOffline: false
                  })
                  .then(res => {
                    console.log("created user details");
                  })
                  .catch(err => {
                    console.error(err);
                  });
            })
            .catch(err => {
              console.error(err);
            });
        }
      })
      .catch(err => {
        if (err.code == "auth/email-already-in-use") {
          openSnackbar({
            message: SIGNUP_EMAIL_ALREADY_FOUND,
            timeout: SNACKBAR_TIMEOUT
          });
        }
      });
  };
  const getuserDetails = uid => {
    getConnectionStatus(uid);
    if (uid)
      observe = getDb()
        .collection("users")
        .doc(uid)
        .onSnapshot(
          docSnap => {
            if (docSnap.exists) {
              var data = docSnap.data();
              if (data) {
                var username = data.username;
                var email = data.email;
                var last_changed = data.last_changed;
                var state = data.state;
                var color = data.color;
                var goOffline = data.goOffline;

                setLoginInfo({
                  ...loginInfo,
                  isLoggedIn: true,
                  uid: uid,
                  userDetails: {
                    username: username,
                    email: email,
                    last_changed: last_changed,
                    state: state,
                    color: color,
                    goOffline: goOffline
                  }
                });
              } else {
                setLoginInfo({
                  ...loginInfo,
                  isLoggedIn: false,
                  uid: null,
                  userDetails: null
                });
              }
            } else {
              setLoginInfo({
                ...loginInfo,
                isLoggedIn: false,
                uid: null,
                userDetails: null
              });
              console.log("document not found");
            }
          },
          err => {
            console.error(err);
          }
        );
    // else observe();
  };
  return (
    <LoginContext.Provider
      value={{
        state: { loginInfo },
        actions: {
          loginWithEmailAndPwd,
          getuserDetails,
          signUpWithEmailPasswordUsername,
          setLoginDetails,
          logOutUser
        }
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}
