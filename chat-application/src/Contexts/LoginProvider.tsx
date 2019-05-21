import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginContext from "./LoginContext";
import { getAuth, getDb } from "../Firebase/FirebaseDao";
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
    getDb()
      .collection("users")
      .doc(uid)
      .onSnapshot(
        docSnap => {
          console.log("user details updated");
          var data = docSnap.data();
          if (data) {
            var username = data.username;
            var email = data.email;
            var last_changed = data.last_changed;
            var state = data.state;
            var color = data.color;
            var goOffline = data.goOffline;
          }
          setLoginInfo({
            ...loginInfo,
            userDetails: {
              username: username,
              email: email,
              last_changed: last_changed,
              state: state,
              color: color,
              goOffline: goOffline
            }
          });
        },
        err => {
          console.error(err);
        }
      );
  };
  return (
    <LoginContext.Provider
      value={{
        state: { loginInfo },
        actions: {
          loginWithEmailAndPwd,
          getuserDetails,
          signUpWithEmailPasswordUsername,
          setLoginDetails
        }
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

//   const loginWithEmailPassword = async (email, password) => {
//     axios
//       .post(
//         "https://us-central1-chat-application-4596f.cloudfunctions.net/loginWithEmailAndPwd",
//         { email, password }
//       )
//       .then(res => {
//         if (res) {
//           var idToken = res.data.idToken;
//           window.localStorage.setItem("idToken", idToken);
//           var uid = res.data.localId;
//           setLoginInfo({
//             ...loginInfo,
//             uid: uid
//           });
//         }
//       })
//       .catch(err => {
//         setLoginInfo({
//           ...loginInfo,
//           user: null,
//           isLoggedIn: false,
//           uid: null
//         });
//         console.error(err);
//       });
//   };
//   const verifyToken = async idToken => {
//     const AuthStr = "Bearer ".concat(idToken);
//     axios
//       .post(
//         "https://us-central1-chat-application-4596f.cloudfunctions.net/appExpress/getUser",
//         { uid: loginInfo.uid },
//         { headers: { Authorization: AuthStr } }
//       )
//       .then(res => {
//         setLoginInfo({ ...loginInfo, user: res.data.user, isLoggedIn: true });
//         // console.log(res);
//       })
//       .catch(err => {
//         setLoginInfo({ ...loginInfo, user: null, isLoggedIn: false });
//         console.error(err);
//       });
//   };
