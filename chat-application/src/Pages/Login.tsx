import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

import { Redirect, NavLink, HashRouter, Router } from "react-router-dom";
import Button from "@material-ui/core/Button";
import icon from "../Components/emoticons/chat-app-icon.png";
import axios from "axios";
import LoginContext from "../Contexts/LoginContext";
import Header from "../Layout/Header";
import Signup from "./Signup";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const {
    state: { loginInfo },
    actions: { loginWithEmailAndPwd }
  } = useContext<any>(LoginContext);

  if (!isSignUp)
    return (
      <React.Fragment>
        <Header />
        <div className="login-dialog">
          <img src={icon} className="app-icon" />
          <h1>Welcome !!!</h1>
          <form>
            <TextField
              label="Email"
              fullWidth
              type="email"
              onChange={value => {
                setEmail(value.currentTarget.value);
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              onChange={value => {
                setPassword(value.currentTarget.value);
              }}
              variant="outlined"
            />
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => {
                loginWithEmailAndPwd(email, password);
                // loginWithEmailPassword(email, password);
              }}
            >
              Login
            </Button>
            <Button
              fullWidth
              color="primary"
              onClick={() => {
                setIsSignUp(true);
              }}
            >
              Signup
            </Button>
          </form>
        </div>
      </React.Fragment>
    );
  else
    return (
      <Signup
        setIsSignUp={(isSignUp: boolean) => {
          setIsSignUp(isSignUp);
        }}
      />
    );
}
