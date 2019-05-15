import React, { useContext } from "react";
import { openModal } from "../Components/CustomBootDialog";
import Login from "../Pages/Login";
import icon from "../Components/emoticons/chat-app-icon.png";
import LoginContext from "../Contexts/LoginContext";
export default function Header() {
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  return (
    <div className="header">
      <h2>
        {/* <img src={icon} className="app-icon-small" /> */}
        Chat App
      </h2>
      <div className="navlinks">
        <div
          className="nav-item"
          onClick={() => {
            openModal(<Login />);
          }}
        >
          {loginInfo.user == null ? null : loginInfo.user.username}
        </div>
      </div>
    </div>
  );
}
