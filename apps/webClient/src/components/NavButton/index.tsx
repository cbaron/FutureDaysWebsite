import React from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {
  type: string;
  text: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  aboutUs: {
    backgroundColor: "white",
    borderRadius: 0,
    width: 60,
    height: 200,
  },
  ourWork: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 4px white",
    width: 60,
    height: 200,
  },
  buttonLabel: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontSize: 20,
  },
}));

const NavButton: React.FC<Props> = ({ type, text }) => {
  const classes = useStyles();
  return (
    <Button
      className={type === "about" ? classes.aboutUs : classes.ourWork}
      classes={{ label: classes.buttonLabel }}
    >
      <strong>{text}</strong>
    </Button>
  );
};

export default NavButton;
