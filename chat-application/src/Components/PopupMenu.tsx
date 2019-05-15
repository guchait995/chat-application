import React, { useEffect, useContext } from "react";
import { Popover } from "@material-ui/core";
import LoginContext from "../Contexts/LoginContext";
export default function PopupMenu(props) {
  const { show, anchorEl } = props;
  var onlineUsers = [
    "sourav",
    "guchait995",
    "pragya",
    "jaya987",
    "swapan98",
    "pragya1996",
    "sourav95"
  ];
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  return (
    <Popover
      open={show}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left"
      }}
      anchorEl={anchorEl}
      anchorPosition={{ top: 10, left: 10 }}
      onClose={() => {
        props.onClose();
      }}
    >
      <div className="popupmenu">
        <h3>{loginInfo.user.username}</h3>
        <div className="line-break" />
        <h5>{loginInfo.user.email}</h5>
        <div className="online-user">
          <div className="online" />
          ONLINE USERS
        </div>
        <div className="line-break" />
        <div className="online-usernames">
          {onlineUsers.map((online, key) => {
            return (
              <React.Fragment>
                {onlineUsers[0] != online ? (
                  <div className="light-line-break" />
                ) : null}
                <div className="online-username" key="key">
                  {online}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div />
      </div>
    </Popover>
  );
}
