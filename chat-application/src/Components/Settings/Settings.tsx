import React, { useState, useEffect, useContext } from "react";
import SettingsRow from "./SettingsRow";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/styles";
import ColorChooser from "./ColorChooser";
import LoginContext from "../../Contexts/LoginContext";
import { hideOffline } from "../../Firebase/FirebaseDao";
export default function Settings(props) {
  const { userDetails, uid } = props;
  const [offline, setOffline] = useState<boolean>(
    userDetails.goOffline != null ? userDetails.goOffline : false
  );
  const useStyles = makeStyles(theme => ({
    colorSwitchBase: {
      color: "#663100",
      "&$colorChecked": {
        color: "#663100",
        "& + $colorBar": {
          backgroundColor: "#663100"
        }
      }
    },
    colorBar: {},
    colorChecked: { color: "#663100" }
  }));
  const classes = useStyles();
  return (
    <div>
      <div className="settings-modal">
        <div className="settings-heading">Profile Settings </div>
        <div className="line-break" />
        <div className="settings-body">
          <SettingsRow left={"Username"} right={userDetails.username} />
          <div className="line-break" />
          <SettingsRow left={"Email"} right={userDetails.email} />
          <div className="line-break" />

          <SettingsRow
            left={"Go Offline"}
            right={
              <Switch
                checked={offline}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar
                }}
                value="offlineSwitch"
                onChange={e => {
                  setOffline(e.currentTarget.checked);
                  hideOffline(e.currentTarget.checked, uid);
                }}
              />
            }
          />
          <div className="line-break" />
          <SettingsRow
            left={"Colors"}
            right={<ColorChooser userDetails={userDetails} uid={uid} />}
          />
        </div>
      </div>
    </div>
  );
}
