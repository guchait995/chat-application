import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Redirect, NavLink, HashRouter, Router } from "react-router-dom";
import Button from "@material-ui/core/Button";
import icon from "../Components/emoticons/chat-app-icon.png";
import axios from "axios";
import LoginContext from "../Contexts/LoginContext";
import Header from "../Layout/Header";
import Signup from "./Signup";
import { InputAdornment, IconButton, FormControl } from "@material-ui/core";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
          <h1>Welcome !!!!</h1>
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
            <FormControl fullWidth>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                onChange={value => {
                  setPassword(value.currentTarget.value);
                }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
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
