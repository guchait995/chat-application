import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import axios from "axios";
export default function ChatDisplay() {
  const [messages, setMessages] = useState([]);
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
  var isMounted = true;
  const getMessages = () => {
    axios
      .get(
        "https://us-central1-chat-application-4596f.cloudfunctions.net/app/chats"
      )
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (isMounted) {
      isMounted = false;
      setInterval(() => {
        getMessages();
      }, 10000);
    }
  }, []);
  return (
    <div className="chats">
      <div className="chats-display">
        {messages.map((chat, key) => {
          return <Chat chat={chat} />;
        })}
      </div>
    </div>
  );
}
