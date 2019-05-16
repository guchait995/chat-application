import React, { useContext, useState, useEffect } from "react";
import menu from "../Components/emoticons/menu.svg";
import LoginContext from "../Contexts/LoginContext";
import PopupMenu from "../Components/PopupMenu";
export default function Header() {
  // var anchorEl: any;
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext<any>(LoginContext);
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>();
  return (
    <div className="header">
      <h2>Chat App</h2>
      <div className="navlinks">
        <div
          className="nav-item"
          onClick={event => {
            setAnchorEl(event.currentTarget);
            setOpen(!open);
          }}
        >
          {loginInfo.userDetails == null ? null : (
            <React.Fragment>
              <img src={menu} />
              <PopupMenu
                show={open}
                anchorEl={anchorEl}
                onClose={() => {
                  setOpen(false);
                }}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
