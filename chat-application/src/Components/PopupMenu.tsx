import React, { useEffect, useContext, useState } from "react";
import { Popover, Button } from "@material-ui/core";
import LoginContext from "../Contexts/LoginContext";
import {
  getConnectionStatus,
  getDb,
  getAuth,
  setOffline
} from "../Firebase/FirebaseDao";
import { getLastSeen } from "../Utilities/Util";
import { NavLink } from "react-router-dom";
import Login from "../Pages/Login";
export default function PopupMenu(props) {
  const { show, anchorEl } = props;
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
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
          if (data) users.push(data);
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
    setOffline(loginInfo.uid);
    getAuth().signOut();
  };
  // const AllRegUsers = getAllUsers();
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
        <div className="username-container">
          <span className="left">
            <h3 className="popupmenu-username">
              {loginInfo.userDetails.username}
            </h3>
          </span>
          <span className="right">
            <Button
              onClick={() => {
                handleLogout();
              }}
              className="logout-button"
            >
              LOGOUT
            </Button>
          </span>
        </div>
        <br className="break" />
        <div className="line-break" />
        <h5>{loginInfo.userDetails.email}</h5>
        <div className="online-user">USERS</div>
        <div className="line-break" />
        <div className="online-usernames">
          {allUsers.map((online, key) => {
            if (online.username != loginInfo.uid)
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
