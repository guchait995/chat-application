import React, { useContext, useEffect } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import "./styles/stylesheet.css";
import Login from "./Pages/Login";
import LoginContext from "./Contexts/LoginContext";
import Chats from "./Pages/Chats";
import LoginProvider from "./Contexts/LoginProvider";
import LoadingPage from "./Components/LoadingPage";
import { getAuth } from "./Firebase/FirebaseDao";
function App() {
  return (
    <div>
      <LoginProvider>
        <HashRouter>
          <Route path="/" component={LoginWrapper} />
          <PrivateRoute path="/chats" component={Chats} />
        </HashRouter>
      </LoginProvider>
    </div>
  );
}

function LoginWrapper(props) {
  const {
    state: { loginInfo },
    actions: { getuserDetails, setLoginDetails }
  } = useContext(LoginContext);
  useEffect(() => {
    var isMounted = false;
    if (!isMounted) {
      isMounted = true;

      getAuth().onAuthStateChanged(firebaseUser => {
        var user = firebaseUser;
        if (user) {
          setLoginDetails(true, user.uid, null);
        } else {
          setLoginDetails(false, null, null);
        }
      });
    }
  }, []);

  if (loginInfo.isLoggedIn == false && loginInfo.uid == null) {
    return <Login />;
  }
  if (loginInfo.isLoggedIn && loginInfo.userDetails && loginInfo.uid != null) {
    //mainpage
    console.log(loginInfo.userDetails);
    return <Chats />;
  }
  if (loginInfo.isLoggedIn && loginInfo.uid != null && !loginInfo.userDetails) {
    getuserDetails(loginInfo.uid);
  }
  return <LoadingPage />;
}

function PrivateRoute({ component: Component, ...rest }) {
  const {
    state: { loginInfo }
  } = useContext(LoginContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (!loginInfo.isLoggedIn) {
          return <Login {...props} />;
        }
        return <Component {...props} />;
      }}
    />
  );
}

export default App;
