import React from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

interface Props {
  children: React.ReactNode;
}

// placholder, should dynamically change via useLocation
const RED = "rgb(177,32,41)";
const RED_GRADIENT =
  "linear-gradient(45deg, rgba(177,32,41,1) 0%, rgba(244,121,32,1) 100%)";
const GREEN = "rgb(14,124,63)";
const GREEN_GRADIENT =
  "linear-gradient(45deg, rgba(14,124,63,1) 0%, rgba(190,198,64,1) 100%)";

const BLUE = "rgb(28,85,119)";
const BLUE_GRADIENT =
  "linear-gradient(45deg, rgba(28,85,119,1) 0%, rgba(46,192,209,1) 100%)";
const YELLOW = "rgb(190,121,42)";
const YELLOW_GRADIENT =
  "linear-gradient(45deg, rgba(190,121,42,1) 0%, rgba(254,228,104,1) 100%)";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "scroll",
  },
  redPageWrapper: {
    height: "100%",
    backgroundColor: RED,
    background: RED_GRADIENT,
  },
  greenPageWrapper: {
    height: "100%",
    backgroundColor: GREEN,
    background: GREEN_GRADIENT,
  },
  bluePageWrapper: {
    height: "100%",
    backgroundColor: BLUE,
    background: BLUE_GRADIENT,
  },
  yellowPageWrapper: {
    height: "100%",
    backgroundColor: YELLOW,
    background: YELLOW_GRADIENT,
  },
  pageContainer: {
    padding: 0,
  },
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  let location = useLocation();

  const derivePageBackgroundClass = (path: string) => {
    if (path === "/") return classes.redPageWrapper;
    if (path === "/our-work") return classes.greenPageWrapper;
    if (path === "/about") return classes.bluePageWrapper;
    if (path === "/lets-talk") return classes.yellowPageWrapper;
  };

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Box className={derivePageBackgroundClass(location.pathname)}>
          <Container maxWidth="md" className={classes.pageContainer}>
            {children}
          </Container>
        </Box>
      </main>
    </div>
  );
};

export default View;
