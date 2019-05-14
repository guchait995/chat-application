import React from "react";
import { openModal } from "../Components/CustomBootDialog";
import Login from "../Pages/Login";
import icon from "../Components/emoticons/chat-app-icon.png";
export default function Header() {
  return (
    <div className="header">
      <h2>
        {/* <img src={icon} className="app-icon-small" /> */}
        Chat Application
      </h2>
      <div className="navlinks">
        <div
          className="nav-item"
          onClick={() => {
            openModal(<Login />);
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
}
