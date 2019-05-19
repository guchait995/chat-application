import axios from "axios";
import {
  EMOJI_URL,
  HAPPY_EMOJI_CODE,
  SMILE_EMOJI_CODE,
  CONFUSED_EMOJI_CODE,
  SAD_EMOJI_CODE,
  SNACKBAR_TIMEOUT,
  EMOJI_TEXT_EMPTY
} from "../AppConstants";
import { openSnackbar } from "../Components/CustomSnackbar";

export const getEmoji = async (text, setEmotion) => {
  if (text) {
    await axios.post(EMOJI_URL, { textMessage: text }).then(res => {
      var data = res.data;
      console.log(data);
      console.log(text);

      if (data && data.message === "OK") {
        var sentiment = data.response;
        console.log(sentiment);
        console.log(sentiment.polarity);
        if (
          sentiment.polarity === "positive" &&
          sentiment.polarity_confidence > 0.7
        ) {
          //when super happy
          setEmotion(HAPPY_EMOJI_CODE);
        } else if (
          sentiment.polarity === "positive" &&
          sentiment.polarity_confidence > 0.2 &&
          sentiment.polarity_confidence <= 0.7
        ) {
          //when smiling
          setEmotion(SMILE_EMOJI_CODE);
        } else if (sentiment.polarity === "neutral") {
          //when no reactino
          setEmotion(CONFUSED_EMOJI_CODE);
        } else if (
          sentiment.polarity === "negative" &&
          sentiment.polarity_confidence > 0.7
        ) {
          //when negative
          setEmotion(SAD_EMOJI_CODE);
        } else if (
          sentiment.polarity === "negative" &&
          sentiment.polarity_confidence > 0.2 &&
          sentiment.polarity_confidence <= 0.7
        ) {
          //when negative
          setEmotion(SAD_EMOJI_CODE);
        }
      }
    });
  } else {
    openSnackbar({ message: EMOJI_TEXT_EMPTY, timeout: SNACKBAR_TIMEOUT });
  }
};
