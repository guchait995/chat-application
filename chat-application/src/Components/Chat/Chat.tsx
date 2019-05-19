import React, { useContext, useState, useEffect } from "react";
import LoginContext from "../../Contexts/LoginContext";
import {
  QUESTION_EMOJI_TEXT,
  HAPPY_EMOJI_TEXT,
  SMILE_EMOJI_TEXT,
  SAD_EMOJI_TEXT,
  CONFUSED_EMOJI_TEXT
} from "../../AppConstants";

import HappyEmoji from "../emoticons/happy.png";
import QuestionIcon from "../emoticons/info.svg";
import SmileEmoji from "../emoticons/smiling.svg";
import SadEmoji from "../emoticons/sad.svg";
import ConfusedEmoji from "../emoticons/confused.svg";
export default function Chat(props) {
  const { name, message, timeStamp, color } = props.chat;

  const { index, totalChats } = props;
  var date = new Date(timeStamp);
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  const [chatRef, setChatRef] = useState<HTMLDivElement>();
  useEffect(() => {
    if (index === totalChats - 1) {
      if (chatRef) {
        chatRef.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [chatRef]);

  return (
    <div
      className="chat"
      ref={el => {
        if (el) setChatRef(el);
      }}
    >
      <div
        className={
          name === loginInfo.userDetails.username
            ? "chat-buble-own"
            : "chat-buble"
        }
      >
        <div className="chat-sender-name" style={{ color }}>
          {name}
        </div>
        <div className="chat-message">{filterMessage(message)}</div>
        <div className="timeStamp">{formatAMPM(date)}</div>
      </div>
    </div>
  );
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
const filterMessage = message => {
  if (message) {
    if (message === QUESTION_EMOJI_TEXT) {
      return <img src={QuestionIcon} className="text-emoji" />;
    } else if (message === HAPPY_EMOJI_TEXT) {
      return <img src={HappyEmoji} className="text-emoji" />;
    } else if (message === SMILE_EMOJI_TEXT) {
      return <img src={SmileEmoji} className="text-emoji" />;
    } else if (message === SAD_EMOJI_TEXT) {
      return <img src={SadEmoji} className="text-emoji" />;
    } else if (message === CONFUSED_EMOJI_TEXT) {
      return <img src={ConfusedEmoji} className="text-emoji" />;
    } else {
      return message;
    }
  }
};
