import React, { useEffect, useState, useContext } from "react";
import Chat from "./Chat";
import axios from "axios";
import LoginContext from "../../Contexts/LoginContext";
import { getDb, getConnectionStatus } from "../../Firebase/FirebaseDao";
import ChatModel from "../../Models/ChatModel";
import { getDate } from "../../Utilities/Util";
export default function ChatDisplay() {
  var currentDate, prevDate;
  const [messages, setMessages] = useState<ChatModel[]>([]);
  var isMounted = true;
  const {
    state: { loginInfo },
    actions: {}
  } = useContext<any>(LoginContext);
  useEffect(() => {
    if (isMounted) {
      isMounted = false;
      getConnectionStatus(loginInfo.uid, loginInfo.userDetails);
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
          ? messages.map((chat: ChatModel, key) => {
              if (messages[0] === chat) {
                currentDate = getDate(chat.timeStamp);
                prevDate = getDate(chat.timeStamp);
              } else {
                currentDate = getDate(chat.timeStamp);
                if (currentDate != prevDate) {
                  //new date arrived update previos date
                  prevDate = currentDate;
                  return (
                    <div>
                      <div className="chat-date-divider">
                        <span>{prevDate}</span>
                      </div>{" "}
                      <div className="line-break" />
                      <Chat
                        chat={chat}
                        index={key}
                        totalChats={messages.length}
                      />
                    </div>
                  );
                  console.log(prevDate);
                } else {
                  //prevDate = currentDate;
                }
              }

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
