import React from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {
  route: string;
  text: string;
  vertical: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  verticalBtn: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 3px white",
    width: 60,
    height: 200,
  },
  horizontalBtn: {
    backgroundColor: "white",
    borderRadius: 0,
    width: 200,
    height: 60,
    "&:hover": {
      backgroundColor: "white",
    },
  },
  verticalLabelRight: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontSize: 20,
    textTransform: "uppercase",
  },
  verticalLabelLeft: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontSize: 20,
    textTransform: "uppercase",
    transform: "rotate(-180deg)",
  },
}));

const NavButton: React.FC<Props> = ({ route, text, vertical }) => {
  const classes = useStyles();

  const deriveButtonLabel = (vertical, route) => {
    if (!vertical) return {};
    return route === "about"
      ? { label: classes.verticalLabelRight }
      : { label: classes.verticalLabelLeft };
  };

  const buttonClass = vertical ? classes.verticalBtn : classes.horizontalBtn;
  const buttonLabelOverride = deriveButtonLabel(vertical, route);

  return (
    <Button className={buttonClass} classes={buttonLabelOverride}>
      <strong>{text}</strong>
    </Button>
  );
};

export default NavButton;
