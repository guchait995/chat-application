import React, { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import HappySmiley from "../emoticons/happy.png";
import axios from "axios";
import { openSnackbar } from "../CustomSnackbar";
import LoginContext from "../../Contexts/LoginContext";
export default function ChatInputLayout() {
  const [text, setText] = useState();
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  const handleSend = () => {
    const AuthStr = "Bearer ".concat(loginInfo.idToken);
    axios
      .post(
        "https://us-central1-chat-application-4596f.cloudfunctions.net/app/chatPost",
        {
          chat: {
            message: text,
            timeStamp: Date.now(),
            name: loginInfo.user.username
          }
        },
        { headers: { Authorization: AuthStr } }
      )
      .then(res => {
        setText("");
        openSnackbar({ message: res.data.message, timeout: 3000 });
      })
      .catch(err => {
        alert("cathed" + err);
      });
  };
  return (
    <div className="chat-input-layout">
      {/* <div className="chat-suggest">
        <span>Suggested Emoji :</span>

        <img src={HappySmiley} className="emoji" />
      </div> */}
      <div className="chat-input-box">
        <TextField
          id="standard-dense"
          label="Type Your Message"
          fullWidth
          multiline
          value={text}
          className="chat-input-field"
          margin="dense"
          onChange={e => {
            setText(e.currentTarget.value);
          }}
        />
        <img src={HappySmiley} className="emoji" />
        <Button
          variant="contained"
          color="primary"
          className="send-button"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
