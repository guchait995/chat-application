import React, { useContext } from "react";
import logo from "./logo.svg";
import { Redirect, HashRouter, Router } from "react-router-dom";
import "./App.css";
import "./styles/stylesheet.css";
import Header from "./Layout/Header";
import Login from "./Pages/Login";
import ChatScreen from "./Components/Chat/ChatScreen";
import LoginContext from "./Contexts/LoginContext";
import Route from "react-router-dom/Route";
import Chats from "./Pages/Chats";
import LoginProvider from "./Contexts/LoginProvider";
import LoadingPage from "./Components/LoadingPage";
import Signup from "./Pages/Signup";

function App() {
  return (
    <div>
      <LoginProvider>
        <HashRouter>
          <Route path="/" component={LoginWrapper} />
          <Route path="/chats" component={Chats} />
        </HashRouter>
      </LoginProvider>
    </div>
  );
}

function LoginWrapper(props) {
  const {
    state: { loginInfo },
    actions: { loginWithEmailPassword, verifyToken }
  } = useContext(LoginContext);
  if (
    !loginInfo.isLoggedIn &&
    loginInfo.user == null &&
    loginInfo.idToken == null
  ) {
    //user isnt logged in
    return <Login />;
  }
  if (
    !loginInfo.isLoggedIn &&
    loginInfo.user == null &&
    loginInfo.idToken != null
  ) {
    verifyToken(loginInfo.idToken);
    return <LoadingPage />;
  }
  if (loginInfo.isLoggedIn && loginInfo.user != null) {
    //mainpage
    return <Chats />;
  }
}

export default App;
