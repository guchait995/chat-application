import React, { useEffect, useContext, useState } from "react";
import { Popover, Button } from "@material-ui/core";
import LoginContext from "../Contexts/LoginContext";
import SettingsIcon from "./emoticons/settings.svg";
import LogoutIcon from "./emoticons/logout.svg";
import { getDb, getAuth, setOffline } from "../Firebase/FirebaseDao";
import { getLastSeen } from "../Utilities/Util";
import { NavLink } from "react-router-dom";
import Login from "../Pages/Login";
import Settings from "./Settings/Settings";
import { openModal } from "./CustomBootDialog";
import ConfirmLogoutPopup from "./ConfirmLogoutPopup";
export default function PopupMenu(props) {
  const { show, anchorEl, userDetails, uid } = props;
  const [enableLogout, setEnableLogout] = useState(false);
  const {
    state: { loginInfo },
    actions: { logOutUser }
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
              userDetails &&
              userDetails.username &&
              data.username &&
              userDetails.username != data.username
            ) {
              users.push(data);
            }
          }
        });
        setAllUsers(users);
      });
  };
  useEffect(() => {
    if (allUsers.length <= 0) {
      getAllUsers();
    }
    var unsubscribe = getDb()
      .collection("users")
      .doc(loginInfo.uid)
      .onSnapshot(res => {
        var data = res.data();
        if (data) {
          if (data.state === "online") {
            setEnableLogout(true);
            unsubscribe();
          }
        }
      });
  }, []);
  const handleLogout = () => {
    logOutUser(uid);
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
        <div className="popupmenu-item-container">
          <p className="popupmenu-username word-wrap-text">
            {" "}
            {userDetails.username}{" "}
          </p>
          <p className="popup-item-container-left">
            <img
              className="icon"
              src={LogoutIcon}
              onClick={() => {
                openModal(
                  <ConfirmLogoutPopup
                    handleLogout={() => {
                      handleLogout();
                    }}
                  />
                );
              }}
            />
          </p>
        </div>
        <div className="line-break" />
        <div className="popupmenu-item-container">
          <p className="popupmenu-email word-wrap-text ">{userDetails.email}</p>
          <p className="popup-item-container-left">
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
          </p>
        </div>
        <div className="online-user">USERS</div>
        <div className="line-break" />
        <div className="online-usernames">
          {allUsers.map((online, key) => {
            return (
              <React.Fragment key={key}>
                {key !== 0 ? <div className="light-line-break" /> : null}
                <div className="popupmenu-item-container">
                  <p className="user-item"> {online.username}</p>
                  <p className="popup-item-container-left">
                    {online.state === "online" ? (
                      <div className="online" />
                    ) : (
                      <div className="last-seen">
                        {getLastSeen(online.last_changed)}
                      </div>
                    )}
                  </p>
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
