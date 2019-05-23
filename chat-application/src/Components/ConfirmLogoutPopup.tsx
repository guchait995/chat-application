import React from "react";
import { Button } from "@material-ui/core";
import { closeDialog } from "./CustomBootDialog";

export default function ConfirmLogoutPopup(props) {
  return (
    <div className="confirm-logout">
      <p>Are you sure you want to logout ?</p>
      <div className="popup-layout">
        <div className="button-layout">
          <Button
            color="secondary"
            onClick={() => {
              closeDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.handleLogout();
              closeDialog();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
