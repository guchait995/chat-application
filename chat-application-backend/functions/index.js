const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const express = require("express");
const appExpress = express();
admin.initializeApp();
const db = admin.firestore();
const rdb = admin.database();
const apiKey = "AIzaSyCczyYTfWTySspf_s6Dne_ncxW5mr70s_w";

exports.initListener = functions.database
  .ref("/status/")
  .onUpdate((change, context) => {
    console.log("changed");
    var prevDataSnapshot = change.before;
    var newDataSnapshot = change.after;
    prevDataSnapshot.forEach(dataPrev => {
      newDataSnapshot.forEach(dataNew => {
        if (
          dataPrev.val().state != dataNew.val().state &&
          dataPrev.val().last_changed != dataNew.val().last_changed
        ) {
          //data updated
          try {
            var data = dataNew.val();
            var key = dataNew.key;
            if (data) {
              console.log(data.last_changed + " , " + data.state);
              if (key) {
                db.collection("users")
                  .doc(key)
                  .set(data, { merge: true })
                  .then(doc => {
                    console.log(doc);
                  })
                  .catch(err => {
                    console.error(err);
                  });
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  });
//   .onOperation("child_changed" || "child_added", snapshot => {
//     console.log("change called");
//     try {
//       var data = snapshot.val();
//       var key = snapshot.key;
//       if (data) {
//         console.log(data.last_changed + " , " + data.state);
//         if (key) {
//           db.collection("users")
//             .doc(key)
//             .set(data, { merge: true })
//             .then(doc => {
//               console.log(doc);
//             })
//             .catch(err => {
//               console.error(err);
//             });
//         }
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   });

// exports.init = functions.https.onRequest((req, res) => {
//   console.log("initialised");
//   var onlineRef = rdb.ref("/status/");
//   console.log(onlineRef.path);
//   if (onlineRef != null) {
//     onlineRef.on("child_added" || "child_changed", snapshot => {
//       var data = snapshot.val();
//       var key = snapshot.key;
//       if (data) {
//         console.log(data.last_changed + " , " + data.state);
//         if (key) {
//           db.doc(`users/${key}`)
//             .set(data, { merge: true })
//             .then(doc => {
//               console.log(doc);
//             })
//             .catch(err => {
//               console.error(err);
//             });
//         }
//       }
//     });
//     onlineRef.on("value", snapshot => {
//       var data = snapshot.val();
//       if (data) {
//         console.log(data.last_changed + " , " + data.state);
//       }
//     });
//   } else {
//     console.log("could not find ref");
//   }
//   res.status(200).send("initialised");
// });
// exports.signUpNewUser = functions.https.onRequest((req, res) => {
//   const handleError = (username, error) => {
//     console.error({ User: username }, error);
//     return res.sendStatus(500);
//   };

//   const handleResponse = (username, status, body) => {
//     console.log(
//       { User: username },
//       {
//         Response: {
//           Status: status,
//           Body: body
//         }
//       }
//     );
//     if (body) {
//       return res.status(200).json(body);
//     }
//     return res.sendStatus(status);
//   };

//   let email = "";
//   try {
//     return cors(req, res, () => {
//       // Authentication requests are POSTed, other requests are forbidden
//       if (req.method !== "POST") {
//         return handleResponse(email, 403, null);
//       }
//       //email = req.body.email;
//       let user = req.body.user;
//       console.log(req.body);
//       email = req.body.email;
//       if (!email) {
//         return handleResponse(email, 400, null);
//       }
//       const password = req.body.password;
//       if (!password) {
//         return handleResponse(email, 400, null);
//       }
//       return axios
//         .post(
//           `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${apiKey}`,
//           {
//             email,
//             password,
//             returnSecureToken: true
//           }
//         )
//         .then(async resp => {
//           //this body has body.uid and body.idToken
//           try {
//             await db.doc(`users/${resp.data.localId}`).set(user); //sets up new user after sign up..!!
//           } catch (e) {
//             console.log(e);
//           }
//           return handleResponse(email, 200, resp.data);
//         })
//         .catch(err => {
//           return handleResponse(email, 401, null); // Invalid username/password
//         });
//     });
//   } catch (error) {
//     return handleError(email, error);
//   }
// });

// exports.loginWithEmailAndPwd = functions.https.onRequest((req, res) => {
//   const handleError = (username, error) => {
//     console.error({ User: username }, error);
//     return res.sendStatus(500);
//   };

//   const handleResponse = (username, status, body) => {
//     console.log(
//       { User: username },
//       {
//         Response: {
//           Status: status,
//           Body: body
//         }
//       }
//     );
//     if (body) {
//       return res.status(200).json(body);
//     }
//     return res.sendStatus(status);
//   };

//   let email = "";
//   try {
//     return cors(req, res, () => {
//       // Authentication requests are POSTed, other requests are forbidden
//       if (req.method !== "POST") {
//         return handleResponse(email, 403, null);
//       }
//       console.log(req.body);
//       email = req.body.email;
//       if (!email) {
//         return handleResponse(email, 400, null);
//       }
//       const password = req.body.password;
//       if (!password) {
//         return handleResponse(email, 400, null);
//       }

//       return axios
//         .post(
//           `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${apiKey}`,
//           {
//             email,
//             password,
//             returnSecureToken: true
//           }
//         )
//         .then(resp => {
//           return handleResponse(email, 200, resp.data);
//         })
//         .catch(err => {
//           return handleResponse(email, 401, null); // Invalid username/password
//         });
//     });
//   } catch (error) {
//     return handleError(email, error);
//   }
// });

// exports.checkUserName = functions.https.onRequest((req, res) => {
//   const handleError = (username, error) => {
//     console.error({ User: username }, error);
//     return res.sendStatus(500);
//   };

//   const handleResponse = (username, status, body) => {
//     console.log(
//       { User: username },
//       {
//         Response: {
//           Status: status,
//           Body: body
//         }
//       }
//     );
//     if (body) {
//       return res.status(200).json(body);
//     }
//     return res.sendStatus(status);
//   };

//   let username = "";
//   try {
//     username = req.body.username;
//     if (username) {
//       const userDoc = db.doc(`usernames/${username}`).get();
//       if (userDoc.exists) {
//         handleResponse(username, 200, { exist: true });
//       } else {
//         handleResponse(username, 200, { exist: false });
//       }
//     }
//     handleResponse(username, 400, null);
//   } catch (error) {
//     return handleError(username, error);
//   }
// });
// const handleSuccess = (message, res) => {
//   res.send({ message: message }).status(200);
// };
// const handleError = (message, res) => {
//   res.send({ message: message }).status(400);
// };

// const validateFirebaseIdToken = async (req, res, next) => {
//   console.log("Check if request is authorized with Firebase ID token");

//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith("Bearer ")
//   ) {
//     console.error(
//       "No Firebase ID token was passed as a Bearer token in the Authorization header.",
//       "Make sure you authorize your request by providing the following HTTP header:",
//       "Authorization: Bearer <Firebase ID Token>",
//       'or by passing a "__session" cookie.'
//     );
//     res.status(403).send("Unauthorized");
//     return;
//   }

//   let idToken;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     console.log('Found "Authorization" header');
//     // Read the ID Token from the Authorization header.
//     idToken = req.headers.authorization.split("Bearer ")[1];
//   } else {
//     // No cookie
//     console.error("please add id token to bearer");
//     res.status(403).send("Unauthorized");
//     return;
//   }

//   try {
//     const decodedIdToken = await admin.auth().verifyIdToken(idToken);
//     console.log("ID Token correctly decoded", decodedIdToken);
//     req.user = decodedIdToken;
//     next();
//   } catch (error) {
//     console.error("Error while verifying Firebase ID token:", error);
//     res.status(403).send("Unauthorized");
//     return;
//   }
// };

// appExpress.use(cors);
// appExpress.use(validateFirebaseIdToken);
// appExpress.use(bodyParser.json()); // support json encoded bodies
// appExpress.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// appExpress.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// //get user using  id token in bearer
// appExpress.post("/getUser", async (req, res) => {
//   try {
//     console.log(req);
//     const userDoc = await db.doc(`users/${req.user.uid}`).get();
//     const userData = userDoc.exists && userDoc.data();
//     if (!userData) {
//       res.status(404).send("User not found");
//       return;
//     }
//     var uid;
//     if (req.body) {
//       uid = req.body.uid;
//     }
//     // {
//     //   "email": "guchaitsourav@gmail.com",
//     //     "username": "sourav"
//     // }
//     res.status(200).send({
//       user: { email: userData.email, username: userData.username, uid: uid }
//     });
//     return;
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Unknown error");
//   }
// });

// appExpress.get("/chats", async (req, res) => {
//   try {
//     var chats = [];
//     await db
//       .collection("chats")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           chats.push(doc.data());
//           console.log(doc.id, "=>", doc.data());
//         });
//       });
//     res.status(200).send(chats);
//   } catch (err) {
//     handleError("Failed ot fetch chats", res);
//     console.error(err);
//   }
// });
// appExpress.post("/chatPost", async (req, res) => {
//   var body = req.body;
//   if (body) {
//     var time = req.body.chat.timeStamp;
//     try {
//       await db
//         .collection("chats")
//         .doc(time.toString())
//         .set(req.body.chat);
//       handleSuccess("Message Sent Successfully", res);
//     } catch (err) {
//       console.error(err);
//       handleError("Failed to sent message", res);
//     }
//   }
// });

// exports.appExpress = functions.https.onRequest(appExpress);
