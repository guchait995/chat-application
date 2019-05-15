import React, { useState } from "react";
import Header from "../Layout/Header";
import { TextField, Button } from "@material-ui/core";
import icon from "../Components/emoticons/chat-app-icon.png";
import { openSnackbar } from "../Components/CustomSnackbar";
export default function Signup(props) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isUserNameConfirmed, setIsUserNameConfimed] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const checkUserExist = () => {
    if (userName === "sourav") {
      openSnackbar({ message: "Username Exists", timeout: 3000 });
    } else {
      setIsUserNameConfimed(true);
      openSnackbar({ message: "Username Available", timeout: 3000 });
    }
  };
  return (
    <React.Fragment>
      <Header />
      <div className="login-dialog">
        <img src={icon} className="app-icon" />
        {isUserNameConfirmed === false ? (
          <h1>Welcome to Signup!!!</h1>
        ) : (
          <h1>Chat App Welcomes You!!! {userName}</h1>
        )}
        <form>
          {isUserNameConfirmed === false ? (
            <div>
              <TextField
                label="Username"
                fullWidth
                onChange={e => {
                  setUserName(e.currentTarget.value);
                }}
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => {
                  checkUserExist();
                }}
              >
                Check Username
              </Button>
            </div>
          ) : (
            <div>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={email === null ? "" : email}
                onChange={e => {
                  setEmail(e.currentTarget.value);
                }}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Password"
                fullWidth
                type="password"
                onChange={value => {
                  // setPassword(value.currentTarget.value);
                }}
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                onChange={value => {
                  // setPassword(value.currentTarget.value);
                }}
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => {
                  //loginWithEmailPassword(email, password);
                }}
              >
                Signup
              </Button>
            </div>
          )}

          <Button
            fullWidth
            color="primary"
            onClick={() => {
              props.setIsSignUp(false);
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
}
