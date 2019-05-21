import React, { useEffect, useContext, useState } from "react";
import { Popover, Button } from "@material-ui/core";
import LoginContext from "../Contexts/LoginContext";
import SettingsIcon from "./emoticons/settings.svg";
import {
  getConnectionStatus,
  getDb,
  getAuth,
  setOffline
} from "../Firebase/FirebaseDao";
import { getLastSeen } from "../Utilities/Util";
import { NavLink } from "react-router-dom";
import Login from "../Pages/Login";
import Settings from "./Settings/Settings";
import { openModal } from "./CustomBootDialog";
export default function PopupMenu(props) {
  const { show, anchorEl, userDetails, uid } = props;
  const {
    state: { loginInfo }
  } = useContext<any>(LoginContext);
  //checks whether users online
  const [allUsers, setAllUsers] = useState<any[]>([]);
  var isMounted = false;
  const getAllUsers = () => {
    getDb()
      .collection("users")
      .orderBy("state", "desc")
      .onSnapshot(collSnapshot => {
        var users: any[] = [];
        collSnapshot.forEach(documentSnapshot => {
          var data = documentSnapshot.data();
          if (data) {
            if (
              userDetails.username != data.username &&
              data.username != null &&
              data.last_changed > 10000
            )
              users.push(data);
          }
        });
        setAllUsers(users);
      });
  };
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      getAllUsers();
    }
  }, []);
  const handleLogout = () => {
    setOffline(uid);
    getAuth().signOut();
  };
  // const AllRegUsers = getAllUsers();
  return (
    <Popover
      open={show}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      anchorEl={anchorEl}
      onClose={() => {
        props.onClose();
      }}
    >
      <div className="popupmenu">
        <div className="username-container">
          <h3 className="popupmenu-username word-wrap-text">
            {userDetails.username}
          </h3>
          <Button
            onClick={() => {
              handleLogout();
            }}
            className="logout-button"
          >
            LOGOUT
          </Button>
        </div>
        <div className="line-break" />
        <div className="email-container">
          <h5 className="word-wrap-text">{userDetails.email}</h5>

          <img
            className="settings-icon"
            src={SettingsIcon}
            onClick={() => {
              openModal(
                <Settings
                  userDetails={loginInfo.userDetails}
                  uid={loginInfo.uid}
                />
              );
            }}
          />
        </div>
        <div className="online-user">USERS</div>
        <div className="line-break" />
        <div className="online-usernames">
          {allUsers.map((online, key) => {
            return (
              <React.Fragment key={key}>
                {key !== 0 ? <div className="light-line-break" /> : null}
                <div className="online-username">
                  {online.username}
                  {online.state === "online" ? (
                    <div className="online" />
                  ) : (
                    <div className="last-seen">
                      {getLastSeen(online.last_changed)}
                    </div>
                  )}
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
