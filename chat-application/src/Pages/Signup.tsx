import React, { useState } from "react";
import Header from "../Layout/Header";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControl
} from "@material-ui/core";
import icon from "../Components/emoticons/chat-app-icon.png";
import { openSnackbar } from "../Components/CustomSnackbar";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
export default function Signup(props) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isUserNameConfirmed, setIsUserNameConfimed] = useState<boolean>(false);
  const [userExist, setUserExist] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(
    false
  );
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const checkUserExist = () => {
    var elem = document.getElementsByName("username");
    if (elem) {
      if (userName === "sourav") {
        setUserExist(true);
        openSnackbar({ message: "User name Exists", timeout: 3000 });
      } else {
        setUserExist(false);
        setIsUserNameConfimed(true);
        openSnackbar({ message: "Username Available", timeout: 3000 });
      }
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
        {isUserNameConfirmed === false ? (
          <form
            onSubmit={() => {
              checkUserExist();
            }}
          >
            <TextField
              label="Username"
              fullWidth
              error={userExist === null ? false : userExist}
              name="username"
              onChange={e => {
                setUserName(e.currentTarget.value);
              }}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              color="primary"
              onClick={() => {
                checkUserExist();
              }}
            >
              Check Username
            </Button>
          </form>
        ) : (
          <form onSubmit={() => {}}>
            <FormControl fullWidth>
              <TextField
                label="Email"
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
                value={password === null ? "" : password}
                type={showPassword ? "text" : "password"}
                onChange={value => {
                  setPassword(value.currentTarget.value);
                }}
                error={
                  password != null && confirmPassword != null
                    ? password != confirmPassword
                    : false
                }
                helperText={
                  password != null && confirmPassword != null
                    ? password != confirmPassword
                      ? "Passwords do not match"
                      : ""
                    : false
                }
                margin="normal"
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

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                onChange={value => {
                  setConfirmPassword(value.currentTarget.value);
                }}
                error={
                  password != null && confirmPassword != null
                    ? password != confirmPassword
                    : false
                }
                helperText={
                  password != null && confirmPassword != null
                    ? password != confirmPassword
                      ? "Passwords do not match"
                      : ""
                    : false
                }
                value={confirmPassword === null ? "" : confirmPassword}
                margin="normal"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {!showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
              type="submit"
              onClick={() => {
                //loginWithEmailPassword(email, password);
              }}
            >
              Signup
            </Button>
          </form>
        )}

        <FormControl fullWidth margin="normal">
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              props.setIsSignUp(false);
            }}
          >
            Login
          </Button>
        </FormControl>
      </div>
    </React.Fragment>
  );
}
