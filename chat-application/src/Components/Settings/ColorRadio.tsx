import React from "react";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/styles";

export default function ColorRadio(props) {
  const { color, selectedColor } = props;
  const useStyles = makeStyles({
    color1: {
      color: color,
      "&$checked": {
        color: color
      }
    },
    checked: {}
  });

  return (
    <Radio
      checked={color === selectedColor}
      onChange={e => props.onChange(e.currentTarget.value)}
      value={color}
      classes={{ root: useStyles().color1, checked: useStyles().checked }}
    />
  );
}
