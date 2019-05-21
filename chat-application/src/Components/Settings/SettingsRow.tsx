import React from "react";

export default function SettingsRow(props) {
  const { left, right } = props;
  return (
    <div className="settings-row">
      <div className="settings-row-left">{left}</div>
      {/* <div className="horizontal-break" /> */}
      <div className="settings-row-right">{right}</div>
    </div>
  );
}
