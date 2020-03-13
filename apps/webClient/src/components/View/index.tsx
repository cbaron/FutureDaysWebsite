import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Logo from "../Logo";
import { usePrevious } from "../../util";

interface Props {
  children: React.ReactNode;
}

const RED_GRADIENT =
  "linear-gradient(45deg, rgba(177,32,41,1) 0%, rgba(244,121,32,1) 100%)";
const GREEN_GRADIENT =
  "linear-gradient(45deg, rgba(14,124,63,1) 0%, rgba(190,198,64,1) 100%)";
const BLUE_GRADIENT =
  "linear-gradient(45deg, rgba(28,85,119,1) 0%, rgba(46,192,209,1) 100%)";
const YELLOW_GRADIENT =
  "linear-gradient(45deg, rgba(190,121,42,1) 0%, rgba(254,228,104,1) 100%)";

// Home Colors
const DARK_ORANGE = "#B12029";
const LIGHT_ORANGE = "#F47920";

// About colors
const DARK_BLUE = "#1C5577";
const LIGHT_BLUE = "#2EC0D1";

// Our Work colors
const DARK_GREEN = "#0E7C3F";
const LIGHT_GREEN = "#BEC640";

// About colors
const DARK_YELLOW = "#BE792A";
const LIGHT_YELLOW = "#FEE468";

const backgroundTransitionsMap = {
  home: {
    ourWork: [
      [LIGHT_GREEN, DARK_ORANGE],
      [DARK_GREEN, LIGHT_GREEN],
    ],
    about: [
      [LIGHT_BLUE, DARK_ORANGE],
      [DARK_BLUE, LIGHT_BLUE],
    ],
    letsTalk: [
      [LIGHT_YELLOW, DARK_ORANGE],
      [DARK_YELLOW, LIGHT_YELLOW],
    ],
  },
  ourWork: {
    home: [
      [LIGHT_ORANGE, DARK_GREEN],
      [DARK_ORANGE, LIGHT_ORANGE],
    ],
    about: [
      [LIGHT_BLUE, DARK_GREEN],
      [DARK_BLUE, LIGHT_BLUE],
    ],
    letsTalk: [
      [LIGHT_YELLOW, DARK_GREEN],
      [DARK_YELLOW, LIGHT_YELLOW],
    ],
  },
  about: {
    ourWork: [
      [LIGHT_GREEN, DARK_BLUE],
      [DARK_GREEN, LIGHT_GREEN],
    ],
    home: [
      [LIGHT_ORANGE, DARK_BLUE],
      [DARK_ORANGE, LIGHT_ORANGE],
    ],
    letsTalk: [
      [LIGHT_YELLOW, DARK_BLUE],
      [DARK_YELLOW, LIGHT_YELLOW],
    ],
  },
  letsTalk: {
    ourWork: [
      [LIGHT_GREEN, DARK_YELLOW],
      [DARK_GREEN, LIGHT_GREEN],
    ],
    about: [
      [LIGHT_BLUE, DARK_YELLOW],
      [DARK_BLUE, LIGHT_BLUE],
    ],
    home: [
      [LIGHT_ORANGE, DARK_YELLOW],
      [DARK_ORANGE, LIGHT_ORANGE],
    ],
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    height: "100%",
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    width: "100%",
    flexGrow: 1,
  },
  redPageWrapper: {
    backgroundColor: DARK_ORANGE,
    backgroundImage: RED_GRADIENT,
  },
  greenPageWrapper: {
    backgroundColor: DARK_GREEN,
    backgroundImage: GREEN_GRADIENT,
  },
  bluePageWrapper: {
    backgroundColor: DARK_BLUE,
    backgroundImage: BLUE_GRADIENT,
  },
  yellowPageWrapper: {
    backgroundColor: DARK_YELLOW,
    backgroundImage: YELLOW_GRADIENT,
  },
  "@keyframes homeToOurWork": {
    "0%": { backgrounPosition: "93% 0%" },
    "100%": { backgroundPosition: "0% 100%" },
  },
  homeToOurWork: {
    backgroundImage: `linear-gradient(225deg, #f47920, #b12029, #8ec640, #0e7c3f)`,
    backgroundSize: "800% 800%",
    animation: "$homeToOurWork 7s ease",
  },
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const prevPath = usePrevious(pathname);

  const derivePageRootBackgroundColor = (path: string, prevPath: string) => {
    const rootClassNames = [classes.root];
    switch (path) {
      case "/":
        rootClassNames.push(classes.redPageWrapper);
        break;
      case "/our-work":
        switch (prevPath) {
          case "/":
            rootClassNames.push(classes.homeToOurWork);
            break;
          default:
            rootClassNames.push(classes.greenPageWrapper);
        }
        break;
      case "/about":
        rootClassNames.push(classes.bluePageWrapper);
        break;
      case "/lets-talk":
        rootClassNames.push(classes.yellowPageWrapper);
        break;
    }
    return clsx(rootClassNames);
  };

  return (
    <div className={derivePageRootBackgroundColor(pathname, prevPath)}>
      <Container maxWidth="md" className={classes.main}>
        <Box mt={16} mb={12}>
          <Grid container item justify="center">
            <Link to="/">
              <Logo />
            </Link>
          </Grid>
        </Box>
        {children}
      </Container>
    </div>
  );
};

export default View;
