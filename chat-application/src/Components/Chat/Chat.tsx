import React from "react";

export default function Chat(props) {
  const { name, message, timeStamp } = props.chat;
  var date = new Date(timeStamp);

  return (
    <div className="chat">
      <div className={name === "sourav" ? "chat-buble-own" : "chat-buble"}>
        <div className="chat-sender-name">{name}</div>
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
