import React from "react";

export default function Chat(props) {
  const { senderName, message } = props.chat;
  return (
    <div className="chat">
      <div
        className={senderName === "sourav" ? "chat-buble-own" : "chat-buble"}
      >
        <div className="chat-sender-name">{senderName}</div>
        <div className="chat-message">{message}</div>
      </div>
    </div>
  );
}
