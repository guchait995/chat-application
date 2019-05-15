import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginContext from "./LoginContext";
export interface LoginInfo {
  user: any;
  isLoggedIn: boolean | null;
  idToken: string | null;
}

export default function LoginProvider(props) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    user: null,
    isLoggedIn: null,
    idToken: null
  });
  const loginWithEmailPassword = async (email, password) => {
    axios
      .post(
        "https://us-central1-chat-application-4596f.cloudfunctions.net/loginWithEmailAndPwd",
        { email, password }
      )
      .then(res => {
        if (res) {
          var idToken = res.data.idToken;
          setLoginInfo({
            ...loginInfo,
            idToken: idToken
          });
        }
      })
      .catch(err => {
        setLoginInfo({
          ...loginInfo,
          user: null,
          isLoggedIn: false,
          idToken: null
        });
        console.error(err);
      });
  };
  const verifyToken = async idToken => {
    const AuthStr = "Bearer ".concat(idToken);
    axios
      .get(
        "https://us-central1-chat-application-4596f.cloudfunctions.net/app/getUser",
        { headers: { Authorization: AuthStr } }
      )
      .then(res => {
        setLoginInfo({ ...loginInfo, user: res.data.user, isLoggedIn: true });
        // console.log(res);
      })
      .catch(err => {
        setLoginInfo({ ...loginInfo, user: null, isLoggedIn: false });
        console.error(err);
      });
  };

  return (
    <LoginContext.Provider
      value={{
        state: { loginInfo },
        actions: {
          loginWithEmailPassword,
          verifyToken
        }
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}
