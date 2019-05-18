const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("querystring");
const http = require("https");
const cors = require("cors")({ origin: true });
const express = require("express");
// const qs = require("qs");
var AYLIENTextAPI = require("aylien_textapi");
const ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");
const appExpress = express();
admin.initializeApp();
const db = admin.firestore();
const rdb = admin.database();
const FIREBASE_API_KEY = "AIzaSyCczyYTfWTySspf_s6Dne_ncxW5mr70s_w";
const AYLIEN_ID = "4b14364f";
const AYLIEN_KEY = "ffb4388d3af9f69af601847fd96d3431";
const AYLIEN_URL = "https://api.aylien.com/api/v1/sentiment";
const WATSON_URL = "https://gateway-lon.watsonplatform.net/tone-analyzer/api";
const WATSON_KEY = "1PQRkOcENisZl_9OCoCLv8YQNLvzxHkBquY7W4p3CiYU";
const WATSON_VERSION = "2017-09-21";

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

//ibm watson tone analyser
exports.geWatsonViaSDK = functions.https.onRequest((req, res) => {
  const toneAnalyzer = new ToneAnalyzerV3({
    version: WATSON_VERSION,
    iam_apikey: WATSON_KEY
  });

  const text =
    "Team, I know that times are tough! Product " +
    "sales have been disappointing for the past three " +
    "quarters. We have a competitive product, but we " +
    "need to do a better job of selling it!";

  const toneParams = {
    tone_input: { text: text },
    content_type: "application/json"
  };

  toneAnalyzer
    .tone(toneParams)
    .then(toneAnalysis => {
      console.log(JSON.stringify(toneAnalysis, null, 2));
    })
    .catch(err => {
      console.log("error:", err);
    });
});

//Aylien text sdk
exports.getAylienViaSDK = functions.https.onRequest(async (req, res) => {
  let text = req.body.text;
  if (text != null) {
    var textapi = new AYLIENTextAPI({
      application_id: AYLIEN_ID,
      application_key: AYLIEN_KEY
    });
    await textapi.sentiment(
      {
        text: "John is a very good football player!"
      },
      function(error, response) {
        if (error === null) {
          res.status(200).send({ message: "OK", response: response });
        } else {
          res.status(401).send({ message: "Failed", response: response });
        }
      }
    );
  } else {
    res.status(400).send("Text EMpty");
  }
});

//Aylien End Point
exports.getAylienEndPoint = functions.https.onRequest(async (req, res) => {
  let text = req.body.text;
  if (text != null) {
    var header = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X- AYLIEN - TextAPI - Application - Key": AYLIEN_KEY,
      "X-AYLIEN-TextAPI-Application-ID": AYLIEN_ID
    };
    var requestData = {
      text: text
    };
    await axios
      .post(url, qs.stringify(requestData), header)
      .then(response => {
        // Do somthing
        res.status(200).send({ message: "OK", response: response });
      })
      .catch(err => {
        // Do somthing
        res.status(401).send({ message: "Failed", response: err });
      });
  } else {
    res.status(400).send("Text Empty");
  }
});

exports.getAylienPostman = functions.https.onRequest(
  async (request, response) => {
    var options = {
      method: "POST",
      hostname: ["api", "aylien", "com"],
      path: ["api", "v1", "sentiment"],
      headers: {
        "X-AYLIEN-TextAPI-Application-Key": "ffb4388d3af9f69af601847fd96d3431",
        "X-AYLIEN-TextAPI-Application-ID": "4b14364f",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.11.0",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        "Postman-Token":
          "c618f189-5ded-4cd0-b699-30889a33d5af,038d4bfe-d214-489f-846b-9ec43ab8ec70",
        Host: "api.aylien.com",
        "accept-encoding": "gzip, deflate",
        "content-length": "28",
        Connection: "keep-alive",
        "cache-control": "no-cache"
      }
    };

    var req = http.request(options, function(res) {
      var chunks = [];

      res.on("data", function(chunk) {
        chunks.push(chunk);
      });

      res.on("end", function() {
        var body = Buffer.concat(chunks);
        response.status(200).send(body);
        console.log(body.toString());
      });
    });

    req.write(qs.stringify({ text: "hello i am soitra" }));
    req.end();
  }
);
//Watson End Point
exports.geWatsonViaEndPoint = functions.https.onRequest(async (req, res) => {});
