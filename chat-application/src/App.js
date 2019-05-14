import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/stylesheet.css";
import Header from "./Layout/Header";
import Login from "./Pages/Login";
import ChatScreen from "./Components/Chat/ChatScreen";

function App() {
  return (
    <div>
      <Header />
      <ChatScreen />
    </div>
  );
}

export default App;
