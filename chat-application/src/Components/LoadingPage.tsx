import React from "react";

export default function LoadingPage(props) {
  return (
    <div className="full-page" hidden={props.hidden}>
      <div className="centre">
        <div className="loading-rotate" />
      </div>
    </div>
  );
}
