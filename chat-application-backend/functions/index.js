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
            var data = dataNew.val(); //this has last_changed and state
            var uid = dataNew.key; //uid
            if (data) {
              console.log(data.last_changed + " , " + data.state);
              if (uid) {
                db.collection("users")
                  .doc(uid)
                  .get()
                  .then(docSnapshot => {
                    var data = docSnapshot.data();
                    console.log(data);
                    if (data && data.username != null && data.email != null) {
                      console.log(
                        "setting docs to current time stamp to uid:" + uid
                      );
                      var offline = data.goOffline;
                      console.log("offline=" + offline);
                      db.collection("users")
                        .doc(uid)
                        .set({
                          email: data.email,
                          username: data.username,
                          color: data.color,
                          last_changed: dataNew.val().last_changed,
                          state: dataNew.val().state,
                          goOffline: offline != null ? offline : false
                        })
                        .then(doc => {
                          console.log("successfully written" + doc);
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    }
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

exports.authListner = functions.auth.user().onDelete(firebaseUser => {
  const email = firebaseUser.email;
  const uid = firebaseUser.uid;
  const providerData = firebaseUser.providerData;
  console.log("deleting user " + email);
  let username = "";
  db.collection("users")
    .doc(uid)
    .get()
    .then(docSnapshot => {
      const data = docSnapshot.data();
      console.log(data);
      username = data.username;
      console.log("deleting username " + username);
      db.collection("usernames")
        .doc(username)
        .delete()
        .then(fire => {
          console.log("deleting from users " + username);
          db.collection("users")
            .doc(uid)
            .delete()
            .then(value => {
              console.log("user deleted");
              rdb
                .ref("/status/" + uid)
                .remove(res => {
                  console.log("user deleted from rdb");
                })
                .catch(err => {
                  console.error("failed to delte from rdb");
                });
            })
            .catch(err => {
              console.error("user deleted." + err);
            });
        })
        .catch(err => {
          console.error("deleting from users." + err);
        });
    })
    .catch(err => {
      console.error("usernames." + err);
    });
});
