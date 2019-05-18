const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors")({ origin: true });
var AYLIENTextAPI = require("aylien_textapi");
const AYLIEN_ID = "4b14364f";
const AYLIEN_KEY = "ffb4388d3af9f69af601847fd96d3431";
app.use(cors);
app.use(bodyParser.json());
app.get("/testApi", async (req, res) => {
  //   let text = req.body.text;
  let text = "Hello this is sourav";
  if (text != null) {
    var textapi = new AYLIENTextAPI({
      application_id: AYLIEN_ID,
      application_key: AYLIEN_KEY
    });
    try {
      await textapi.sentiment(
        {
          text: text
        },
        function(error, response) {
          if (error === null) {
            res.status(200).send({ message: "OK", response: response });
          } else {
            res.status(401).send({ message: "Failed", response: response });
          }
        }
      );
    } catch (err) {
      res.status(401).send({ message: "Failed", response: err });
      console.err(err);
    }
  } else {
    res.status(400).send("Text EMpty");
  }
});
app.post("/getEmoji", (req, res) => {
  if (req && req.body && req.body.textMessage) {
    var textMessage = req.body.textMessage;

    try {
      if (textMessage) {
        var textapi = new AYLIENTextAPI({
          application_id: AYLIEN_ID,
          application_key: AYLIEN_KEY
        });
        textapi.sentiment(
          {
            text: textMessage
          },
          (error, response) => {
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
    } catch (err) {
      // console.log(err);
    }
  } else {
    console.log(req.body);
  }
});
app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
