import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import axios from "axios";
import LoginContext from "../../Contexts/LoginContext";
import { getDb, getConnectionStatus } from "../../Firebase/FirebaseDao";
export default function ChatDisplay() {
  const [messages, setMessages] = useState<any[]>([]);
  var isMounted = true;
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  const [scrollToref, setScrollToref] = useState<any>();
  useEffect(() => {
    if (isMounted) {
      isMounted = false;
      getConnectionStatus(loginInfo.uid);
      var coll = getDb().collection("chats");
      var observer = coll.onSnapshot(
        collSnapshot => {
          var mes: any[] = [];
          collSnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            if (data) mes.push(data);
          });
          setMessages(mes);
        },
        err => {}
      );
    }
  }, []);
  return (
    <div className="chats">
      <div className="chats-display">
        {messages.length > 0
          ? messages.map((chat, key) => {
              return (
                <Chat chat={chat} index={key} totalChats={messages.length} />
              );
            })
          : null}
      </div>
    </div>
  );
}

// const AuthStr = "Bearer ".concat(loginInfo.idToken);
// axios
//   .get(
//     "https://us-central1-chat-application-4596f.cloudfunctions.net/app/chats",
//     { headers: { Authorization: AuthStr } }
//   )
//   .then(res => {
//     setMessages(res.data);
//   })
//   .catch(err => {
//     console.error(err);
//   });
