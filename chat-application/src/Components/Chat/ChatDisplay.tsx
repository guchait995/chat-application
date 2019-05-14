import React from "react";
import Chat from "./Chat";

export default function ChatDisplay() {
  const messages: string[] = ["hi", "hello", "whatsapp"];
  const chats = [
    { message: "hi", senderName: "sourav", timeStamp: "10:00 pm" },
    { message: "hello", senderName: "pragya", timeStamp: "10:02 pm" },
    { message: "ki korcho ??", senderName: "sourav", timeStamp: "10:05 pm" },
    { message: "drawing", senderName: "pragya", timeStamp: "10:07 pm" },
    { message: "koi dekhao", senderName: "sourav", timeStamp: "10:10 pm" },
    { message: "koi gooo", senderName: "sourav", timeStamp: "10:15 pm" },
    { message: "hello", senderName: "sourav", timeStamp: "10:30 pm" },
    { message: "hi", senderName: "sourav", timeStamp: "10:00 pm" },
    { message: "hello", senderName: "pragya", timeStamp: "10:02 pm" },
    { message: "ki korcho ??", senderName: "sourav", timeStamp: "10:05 pm" },
    { message: "drawing", senderName: "pragya", timeStamp: "10:07 pm" },
    { message: "koi dekhao", senderName: "sourav", timeStamp: "10:10 pm" },
    { message: "koi gooo", senderName: "sourav", timeStamp: "10:15 pm" },
    { message: "hello", senderName: "sourav", timeStamp: "10:30 pm" }
  ];
  return (
    <div className="chats">
      <div className="chats-display">
        {chats.map((chat, key) => {
          return <Chat chat={chat} />;
        })}
      </div>
    </div>
  );
}
