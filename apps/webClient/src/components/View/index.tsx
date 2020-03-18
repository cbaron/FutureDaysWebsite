import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Logo from "../Logo";
import { smallScreenMaxBreakpoint } from "../../utils";
import MobileNav from "../../components/MobileNav";

interface Props {
  children: React.ReactNode;
}

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
    backgroundColor: RED,
    background: RED_GRADIENT,
  },
  greenPageWrapper: {
    backgroundColor: GREEN,
    background: GREEN_GRADIENT,
  },
  bluePageWrapper: {
    backgroundColor: BLUE,
    background: BLUE_GRADIENT,
  },
  yellowPageWrapper: {
    backgroundColor: YELLOW,
    background: YELLOW_GRADIENT,
  },
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery(smallScreenMaxBreakpoint);
  const { pathname } = useLocation();

  const derivePageRootBackgroundColor = (path: string) => {
    let coloredPageRoot = [classes.root];
    switch (path) {
      case "/":
        coloredPageRoot.push(classes.redPageWrapper);
        break;
      case "/our-work":
        coloredPageRoot.push(classes.greenPageWrapper);
        break;
      case "/about":
        coloredPageRoot.push(classes.bluePageWrapper);
        break;
      case "/lets-talk":
        coloredPageRoot.push(classes.yellowPageWrapper);
        break;
    }
    return clsx(coloredPageRoot);
  };

  return (
    <div className={derivePageRootBackgroundColor(pathname)}>
      <Container maxWidth="md" className={classes.main}>
        {isSmallScreen && <MobileNav />}
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
