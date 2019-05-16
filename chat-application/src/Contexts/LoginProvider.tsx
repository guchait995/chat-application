import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginContext from "./LoginContext";
import { getAuth, getDb } from "../Firebase/FirebaseDao";
import { userInfo } from "os";
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
    getAuth().signInWithEmailAndPassword(email, password);
  };
  const signUpWithEmailPasswordUsername = (email, password, username) => {
    getAuth()
      .createUserWithEmailAndPassword(email, password)
      .then(firebaseUser => {
        var user = firebaseUser.user;
        console.log(user);
        if (user) {
          getDb()
            .collection("users")
            .doc(user.uid)
            .set({
              email: email,
              username: username,
              state: "online",
              last_changed: 1000000
            });
          getDb()
            .collection("usernames")
            .doc(username)
            .set({ email: email });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getuserDetails = uid => {
    getDb()
      .collection("users")
      .doc(uid)
      .get()
      .then(docSnap => {
        var data = docSnap.data();
        if (data) {
          var username = data.username;
          var email = data.email;
          var lastOnlineChange = data.last_change;
          var status = data.status;
        }
        setLoginInfo({
          ...loginInfo,
          userDetails: {
            username: username,
            email: email,
            lastOnlineChange: lastOnlineChange,
            status: status
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
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
