import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {
  route: string;
  text: string;
  vertical?: boolean;
  isLeft?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  verticalBtn: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 3px white",
    width: 60,
    height: 200,
    padding: "30px 10px",
    textTransform: "uppercase",
  },
  horizontalBtn: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 3px white",
    width: 200,
    height: 60,
    textTransform: "uppercase",
    fontSize: 18,
  },
  verticalLabel: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontSize: 18,
  },
  verticalLabelLeft: {
    transform: "rotate(-180deg)",
  },
}));

const NavButton: React.FC<Props> = ({
  route,
  text,
  vertical = false,
  isLeft = false,
}) => {
  const classes = useStyles();

  const deriveButtonLabel = (vertical: boolean, isLeft: boolean) => {
    if (!vertical) return {};
    const labelOverride = [classes.verticalLabel];
    if (isLeft) labelOverride.push(classes.verticalLabelLeft);
    return { label: clsx(labelOverride) };
  };

  const buttonClass = vertical ? classes.verticalBtn : classes.horizontalBtn;
  const buttonLabelOverride = deriveButtonLabel(vertical, isLeft);

  return (
    <Button className={buttonClass} classes={buttonLabelOverride}>
      <strong>{text}</strong>
    </Button>
  );
};

export default NavButton;
