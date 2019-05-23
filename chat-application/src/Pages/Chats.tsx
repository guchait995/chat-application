import React from "react";
import Header from "../Layout/Header";
import ChatScreen from "../Components/Chat/ChatScreen";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

export default function Chats() {
  const theme = createMuiTheme({
    palette: {
      primary: { main: "#11cb5f" }, // Purple and green play nicely together.
      secondary: { main: "#11cb5f" }
    }
  });
  return (
    <div>
      <Header />
      <ChatScreen />
    </div>
  );
}
