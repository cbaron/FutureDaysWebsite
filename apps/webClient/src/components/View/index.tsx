import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { camelCase } from "change-case";
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
const DARK_ORANGE = "rgba(177, 32, 41, 1)";
const LIGHT_ORANGE = "rgba(244, 121, 32, 1)";

// About colors
const DARK_BLUE = "rgba(28, 85, 119, 1)";
const LIGHT_BLUE = "rgba(46, 192, 209, 1)";

// Our Work colors
const DARK_GREEN = "rgba(14, 124, 63, 1)";
const LIGHT_GREEN = "rgba(190, 198, 64, 1)";

// About colors
const DARK_YELLOW = "rgba(190, 121, 42, 1)";
const LIGHT_YELLOW = "rgba(254, 228, 104, 1)";

const routes = [
  { path: "home", colors: [DARK_ORANGE, LIGHT_ORANGE] },
  { path: "ourWork", colors: [DARK_GREEN, LIGHT_GREEN] },
  { path: "about", colors: [DARK_BLUE, LIGHT_BLUE] },
  { path: "letsTalk", colors: [DARK_YELLOW, LIGHT_YELLOW] },
];

function generateBImg(from, to, colors) {
  const { fromColor1, fromColor2, toColor1, toColor2 } = colors;
  return {
    [camelCase(`${from}To${to}`)]: {
      backgroundImage: `linear-gradient(45deg, ${toColor1} 0%, ${toColor2} 33%, ${fromColor1} 66%, ${fromColor2} 100%)`,
    },
  };
}

const backgrounGradientsObj = {};
routes.forEach(from => {
  const fromPage = from.path;
  const fromColor1 = from.colors[0];
  const fromColor2 = from.colors[1];
  routes.forEach(to => {
    const toPage = to.path;
    if (fromPage === toPage) return;
    const toColor1 = to.colors[0];
    const toColor2 = to.colors[1];
    Object.assign(
      backgrounGradientsObj,
      generateBImg(fromPage, toPage, {
        fromColor1,
        fromColor2,
        toColor1,
        toColor2,
      }),
    );
  });
});

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
    background: RED_GRADIENT,
  },
  greenPageWrapper: {
    backgroundColor: DARK_GREEN,
    background: GREEN_GRADIENT,
  },
  bluePageWrapper: {
    backgroundColor: DARK_BLUE,
    background: BLUE_GRADIENT,
  },
  yellowPageWrapper: {
    backgroundColor: DARK_YELLOW,
    background: YELLOW_GRADIENT,
  },
  "@keyframes homeToOurWork": {
    "0%": { backgroundPosition: "66% 66%" },
    "50%": { backgroundPosition: "33% 33%" },
    "100%": { backgroundPosition: "0% 0%" },
  },
  "@keyframes opacity": {
    "0%": { opacity: 1 },
    "20%": { opacity: 0.4 },
    "40%": { opacity: 0.2 },
    "50%": { opacity: 0.0 },
    "60%": { opacity: 0.2 },
    "80%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
  homeToOurWork: {
    animation: "$opacity .75s forwards",
  },
  first: {
    animation: "$homeToOurWork 5s forwards",
  },
  backgroundAnimationHelper: {
    backgroundImage:
      "linear-gradient(45deg, rgba(14,124,63,1) 0%, rgba(142,198,64,1) 33%, rgba(244,121,32,1) 66%, rgba(177,32,41,1) 100%)",
    backgroundPosition: "66% 66%",
    backgroundSize: "800%",
    /*
    position: "absolute",
    height: "100%",
    width: "100%",
    left: 0,
    top: 0,
    */
  },
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const prevPath = usePrevious(pathname);

  const backgroundAnimationHelperClasses = [classes.backgroundAnimationHelper];

  const derivePageRootBackgroundColor = (path: string, prevPath: string) => {
    const rootClassNames = [classes.root, classes.backgroundAnimationHelper];
    switch (path) {
      case "/":
        //rootClassNames.push(classes.redPageWrapper);
        break;
      case "/our-work":
        switch (prevPath) {
          case "/":
            rootClassNames.push(classes.first);
            //backgroundAnimationHelperClasses.push(classes.first);
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
    <>
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
      {/*<div className={clsx(backgroundAnimationHelperClasses)} />*/}
    </>
  );
};

export default View;
