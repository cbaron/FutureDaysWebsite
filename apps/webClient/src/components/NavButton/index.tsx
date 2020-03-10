import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  baseButton: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 3px white",
    textTransform: "uppercase",
    fontSize: 18,
  },
  verticalBtn: {
    width: 60,
    height: 200,
    marginTop: 40,
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
  isCurrentPage: {
    background: "white",
  },
}));

const NavButton: React.FC<Props> = ({
  route,
  text,
  isVertical = false,
  isLeft = false,
}) => {
  const classes = useStyles();
  let location = useLocation();

  const deriveButtonClassOverrides = (vertical: boolean, isLeft: boolean) => {
    if (!vertical) return {};
    const labelOverride = [classes.verticalLabel];
    if (isLeft) labelOverride.push(classes.verticalLabelLeft);
    return { label: clsx(labelOverride) };
  };

  const deriveButtonClassName = (vertical: boolean, path: string) => {
    const buttonClass = [classes.baseButton];
    if (path === location.pathname) buttonClass.push(classes.isCurrentPage);
    if (vertical) {
      buttonClass.push(classes.verticalBtn);
    } else {
      buttonClass.push(classes.horizontalBtn);
    }
    return clsx(buttonClass);
  };

  const buttonClass = deriveButtonClassName(isVertical, route);
  const buttonLabelOverride = deriveButtonClassOverrides(isVertical, isLeft);

  return (
    <Button
      className={buttonClass}
      classes={buttonLabelOverride}
      component={NavLink}
      to={route}
    >
      <strong>{text}</strong>
    </Button>
  );
};

export default NavButton;
