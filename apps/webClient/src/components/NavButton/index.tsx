import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {
  route: string;
  text: string;
  isVertical?: boolean;
  isLeft?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  baseBurron: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 3px white",
    textTransform: "uppercase",
    fontSize: 18,
  },
  verticalBtn: {
    width: 60,
    height: 200,
  },
  horizontalBtn: {
    width: 200,
    height: 60,
  },
  verticalLabel: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
  },
  verticalLabelLeft: {
    transform: "rotate(-180deg)",
  },
}));

const NavButton: React.FC<Props> = ({
  route,
  text,
  isVertical = false,
  isLeft = false,
}) => {
  const classes = useStyles();

  const deriveButtonClassOverrides = (vertical: boolean, isLeft: boolean) => {
    if (!vertical) return {};
    const labelOverride = [classes.verticalLabel];
    if (isLeft) labelOverride.push(classes.verticalLabelLeft);
    return { label: clsx(labelOverride) };
  };

  const horizontalButton = clsx([classes.baseBurron, classes.horizontalBtn]);
  const verticalButton = clsx([classes.baseBurron, classes.verticalBtn]);

  const buttonClass = isVertical ? verticalButton : horizontalButton;
  const buttonLabelOverride = deriveButtonClassOverrides(isVertical, isLeft);

  return (
    <Button className={buttonClass} classes={buttonLabelOverride}>
      <strong>{text}</strong>
    </Button>
  );
};

export default NavButton;
