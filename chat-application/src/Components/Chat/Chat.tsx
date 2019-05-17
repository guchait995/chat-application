import React, { useContext, useState, useEffect } from "react";
import LoginContext from "../../Contexts/LoginContext";

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
    console.log(loginInfo.userDetails);
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
        <div className="chat-message">{message}</div>
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
