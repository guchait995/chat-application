import React from "react";
import { LoginInfo } from "./LoginProvider";
export default React.createContext({
  state: {
    loginInfo: {
      user: null,
      isLoggedIn: null,
      idToken: null
    } as LoginInfo
  }
});
