import React, { useState, useEffect } from "react";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import { makeStyles } from "@material-ui/styles";
import { USERNAME_COLORS } from "../../AppConstants";
import ColorRadio from "./ColorRadio";
import { setColorBackend } from "../../Firebase/FirebaseDao";
export default function ColorChooser(props) {
  const { userDetails, uid } = props;
  const [color, setColor] = useState<string>(userDetails.color);
  const [colors, setColors] = useState<string[]>([]);
  useEffect(() => {
    setColors(USERNAME_COLORS);
  }, []);
  function handleChange(selectedColor) {
    if (uid) {
      setColor(selectedColor);
      setColorBackend(selectedColor, uid);
    }
  }
  return (
    <div className="color-chooser">
      {colors.map(element => {
        return (
          <ColorRadio
            selectedColor={color}
            color={element}
            onChange={e => {
              handleChange(e);
            }}
          />
        );
      })}
    </div>
  );
}
