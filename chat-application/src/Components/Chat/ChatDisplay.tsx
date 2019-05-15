import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import axios from "axios";
import LoginContext from "../../Contexts/LoginContext";
export default function ChatDisplay() {
  const [messages, setMessages] = useState([]);
  var isMounted = true;
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  const getMessages = () => {
    const AuthStr = "Bearer ".concat(loginInfo.idToken);
    axios
      .get(
        "https://us-central1-chat-application-4596f.cloudfunctions.net/app/chats",
        { headers: { Authorization: AuthStr } }
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
