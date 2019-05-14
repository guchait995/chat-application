const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const cors = require("cors")({ origin: true });
app.use(cors);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const admin = require("firebase-admin");
var serviceAccount = require("../backend/chat-application-4596f-4bcdb1f73bb0.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
var handleSuccess = (message, res) => {
  res.send({ message: message }).status(200);
};
var handleError = (message, res) => {
  res.send({ message: message }).status(400);
};

app.get("/", (req, res) => {
  res.send("Hello World!");
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
app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
