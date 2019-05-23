import React, { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import HappyEmoji from "../emoticons/happy.png";
import QuestionIcon from "../emoticons/info.svg";
import SmileEmoji from "../emoticons/smiling.svg";
import SadEmoji from "../emoticons/sad.svg";
import ConfusedEmoji from "../emoticons/confused.svg";
import Ripple from "../emoticons/ripple.svg";
import axios from "axios";
import { openSnackbar } from "../CustomSnackbar";
import LoginContext from "../../Contexts/LoginContext";
import { postMessage } from "../../Firebase/FirebaseDao";
import {
  SNACKBAR_TIMEOUT,
  EMOJI_UPDATES,
  HAPPY_EMOJI_CODE,
  SMILE_EMOJI_CODE,
  SAD_EMOJI_CODE,
  CONFUSED_EMOJI_CODE,
  QUESTION_EMOJI_CODE,
  HAPPY_EMOJI_TEXT,
  CONFUSED_EMOJI_TEXT,
  SMILE_EMOJI_TEXT,
  SAD_EMOJI_TEXT,
  EMOJI_TEXT_EMPTY
} from "../../AppConstants";
import { getEmoji } from "../../Api/ApiCalls";
import { useDebounce } from "../../Utilities/Debounce";
import { handleKeyDown } from "../../Utilities/Util";
export default function ChatInputLayout() {
  const [text, setText] = useState<string>("");
  const debouncedSearchTerm = useDebounce(text, 1000);
  const [emoji, setEmoji] = useState<any>();
  const [emotion, setEmotion] = useState<number>(QUESTION_EMOJI_CODE);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  var timeOut: any = null;
  useEffect(() => {
    if (emotion === QUESTION_EMOJI_CODE) {
      setEmoji(QuestionIcon);
    } else if (emotion === HAPPY_EMOJI_CODE) {
      setEmoji(HappyEmoji);
    } else if (emotion === SMILE_EMOJI_CODE) {
      setEmoji(SmileEmoji);
    } else if (emotion === SAD_EMOJI_CODE) {
      setEmoji(SadEmoji);
    } else if (emotion === CONFUSED_EMOJI_CODE) {
      setEmoji(ConfusedEmoji);
    }
  }, [emotion]);
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      handleEmojiFetch().then(res => {
        setIsSearching(false);
      });
    }
  }, [debouncedSearchTerm]);
  const handleSend = () => {
    postMessage(
      text,
      loginInfo.userDetails.username,
      loginInfo.userDetails.color
    );
    setText("");
  };
  const handleEmojiFetch = async () => {
    await getEmoji(text, a => {
      setEmotion(a);
    });
  };
  const sendEmoji = () => {
    if (emotion === QUESTION_EMOJI_CODE) {
      //postMessageNONE
      openSnackbar({ message: EMOJI_TEXT_EMPTY, timeout: SNACKBAR_TIMEOUT });
    } else if (emotion === HAPPY_EMOJI_CODE) {
      postMessage(
        HAPPY_EMOJI_TEXT,
        loginInfo.userDetails.username,
        loginInfo.userDetails.color
      );
    } else if (emotion === SMILE_EMOJI_CODE) {
      postMessage(
        SMILE_EMOJI_TEXT,
        loginInfo.userDetails.username,
        loginInfo.userDetails.color
      );
    } else if (emotion === SAD_EMOJI_CODE) {
      postMessage(
        SAD_EMOJI_TEXT,
        loginInfo.userDetails.username,
        loginInfo.userDetails.color
      );
    } else if (emotion === CONFUSED_EMOJI_CODE) {
      postMessage(
        CONFUSED_EMOJI_TEXT,
        loginInfo.userDetails.username,
        loginInfo.userDetails.color
      );
    }
    setText("");
  };

  return (
    <div className="chat-input-layout">
      <div className="chat-input-box">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <TextField
            id="standard-dense"
            label="Type Your Message"
            fullWidth
            multiline
            value={text}
            className="chat-input-field"
            margin="dense"
            onKeyDown={e => {
              if (handleKeyDown(e)) {
                handleSend();
              }
            }}
            onChange={e => {
              setText(e.currentTarget.value);
            }}
          />
          <img
            src={!isSearching ? emoji : Ripple}
            className="emoji"
            onClick={() => {
              sendEmoji();
            }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={text.length == 0}
            type="submit"
            className="send-button"
            // onClick={handleSend}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
{
  /* <div className="chat-suggest">
        <span>Suggested Emoji :</span>

        <img src={HappySmiley} className="emoji" />
      </div> */
}

// const AuthStr = "Bearer ".concat(loginInfo.idToken);
// axios
//   .post(
//     "https://us-central1-chat-application-4596f.cloudfunctions.net/appExpress/chatPost",
//     {
//       chat: {
//         message: text,
//         timeStamp: Date.now(),
//         name: loginInfo.user.username
//       }
//     },
//     { headers: { Authorization: AuthStr } }
//   )
//   .then(res => {
//     setText("");
//     openSnackbar({ message: res.data.message, timeout: 3000 });
//   })
//   .catch(err => {
//     alert("cathed" + err);
//   });
