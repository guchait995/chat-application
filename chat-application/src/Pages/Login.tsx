import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { openSnackbar } from "../Components/CustomSnackbar";
import icon from "../Components/emoticons/chat-app-icon.png";
export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = () => {
    // alert(email);
    // alert(password);
    openSnackbar({ message: email, timeout: 3000 });
  };
  return (
    <div className="login-dialog">
      <img src={icon} className="app-icon" />
      <h1>Welcome !!!</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-name"
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
          id="outlined-name"
          label="Password"
          fullWidth
          type="password"
          onChange={value => {
            setPassword(value.currentTarget.value);
          }}
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" fullWidth color="primary" type="submit">
          Login
        </Button>
        <Button fullWidth color="primary" type="submit">
          Signup
        </Button>
      </form>
    </div>
  );
}
