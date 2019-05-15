const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const express = require("express");
const app = express();
admin.initializeApp();
const db = admin.firestore();
const apiKey = "AIzaSyCczyYTfWTySspf_s6Dne_ncxW5mr70s_w";

//signUp User
exports.signUpNewUser = functions.https.onRequest((req, res) => {
  const handleError = (username, error) => {
    console.error({ User: username }, error);
    return res.sendStatus(500);
  };

  const handleResponse = (username, status, body) => {
    console.log(
      { User: username },
      {
        Response: {
          Status: status,
          Body: body
        }
      }
    );
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };

  let email = "";
  try {
    return cors(req, res, () => {
      // Authentication requests are POSTed, other requests are forbidden
      if (req.method !== "POST") {
        return handleResponse(email, 403, null);
      }
      //email = req.body.email;
      let user = req.body.user;
      console.log(req.body);
      email = req.body.email;
      if (!email) {
        return handleResponse(email, 400, null);
      }
      const password = req.body.password;
      if (!password) {
        return handleResponse(email, 400, null);
      }
      return axios
        .post(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`,
          {
            email,
            password,
            returnSecureToken: true
          }
        )
        .then(async resp => {
          //this body has body.uid and body.idToken
          try {
            console.log("line55: ", { user });
            await db.doc(`users/${resp.data.localId}`).set(user); //sets up new user after sign up..!!
          } catch (e) {
            console.log(e);
          }
          return handleResponse(email, 200, resp.data);
        })
        .catch(err => {
          return handleResponse(email, 401, null); // Invalid username/password
        });
    });
  } catch (error) {
    return handleError(email, error);
  }
});

exports.loginWithEmailAndPwd = functions.https.onRequest((req, res) => {
  const handleError = (username, error) => {
    console.error({ User: username }, error);
    return res.sendStatus(500);
  };

  const handleResponse = (username, status, body) => {
    console.log(
      { User: username },
      {
        Response: {
          Status: status,
          Body: body
        }
      }
    );
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };

  let email = "";
  try {
    return cors(req, res, () => {
      // Authentication requests are POSTed, other requests are forbidden
      if (req.method !== "POST") {
        return handleResponse(email, 403, null);
      }
      console.log(req.body);
      email = req.body.email;
      if (!email) {
        return handleResponse(email, 400, null);
      }
      const password = req.body.password;
      if (!password) {
        return handleResponse(email, 400, null);
      }

      return axios
        .post(
          `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`,
          {
            email,
            password,
            returnSecureToken: true
          }
        )
        .then(resp => {
          return handleResponse(email, 200, resp.data);
        })
        .catch(err => {
          return handleResponse(email, 401, null); // Invalid username/password
        });
    });
  } catch (error) {
    return handleError(email, error);
  }
});
const handleSuccess = (message, res) => {
  res.send({ message: message }).status(200);
};
const handleError = (message, res) => {
  res.send({ message: message }).status(400);
};

const validateFirebaseIdToken = async (req, res, next) => {
  console.log("Check if request is authorized with Firebase ID token");

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    // No cookie
    console.error("please add id token to bearer");
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    res.status(403).send("Unauthorized");
    return;
  }
};

app.use(cors);
app.use(validateFirebaseIdToken);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//get user using  id token in bearer
app.get("/getUser", async (req, res) => {
  try {
    console.log(req);
    const userDoc = await db.doc(`users/${req.user.uid}`).get();
    const userData = userDoc.exists && userDoc.data();
    if (!userData) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).send({ user: userData });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Unknown error");
  }
});

app.get("/chats", async (req, res) => {
  try {
    var chats = [];
    await db
      .collection("chats")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          chats.push(doc.data());
          console.log(doc.id, "=>", doc.data());
        });
      });
    res.status(200).send(chats);
  } catch (err) {
    handleError("Failed ot fetch chats", res);
    console.error(err);
  }
});
app.post("/chatPost", async (req, res) => {
  var body = req.body;
  if (body) {
    var time = req.body.chat.timeStamp;
    try {
      await db
        .collection("chats")
        .doc(time.toString())
        .set(req.body.chat);
      handleSuccess("Message Sent Successfully", res);
    } catch (err) {
      console.error(err);
      handleError("Failed to sent message", res);
    }
  }
});

exports.app = functions.https.onRequest(app);
