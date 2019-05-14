import React from "react";
import { openModal } from "../Components/CustomBootDialog";
import Login from "../Pages/Login";

export default function Header() {
  return (
    <div className="header">
      <h2>Chat Application</h2>
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
