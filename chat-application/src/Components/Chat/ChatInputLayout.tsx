import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import HappySmiley from "../emoticons/happy.png";
export default function ChatInputLayout() {
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
          className="chat-input-field"
          margin="dense"
        />
        <img src={HappySmiley} className="emoji" />
        <Button variant="contained" color="primary" className="send-button">
          Send
        </Button>
      </div>
    </div>
  );
}
