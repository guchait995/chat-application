const functions = require("firebase-functions");

const admin = require("firebase-admin");
const bodyParser = require("body-parser");
// const axios = require("axios");
const cors = require("cors")({ origin: true });
admin.initializeApp();
const express = require("express");
const app = express();
const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
const handleSuccess = (message, res) => {
  res.send({ message: message }).status(200);
};
const handleError = (message, res) => {
  res.send({ message: message }).status(400);
};

app.use(cors);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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

exports.app = functions.https.onRequest(app);
