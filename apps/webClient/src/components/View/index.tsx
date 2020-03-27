import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import * as shortid from "shortid";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Logo from "../Logo";
import { smallScreenMaxBreakpoint, usePrevious } from "../../util";
import MobileNav from "../../components/MobileNav";

interface Props {
  children: React.ReactNode;
}

const DARK_GREY = "#23221C";

// Home Colors
const DARK_ORANGE = "#B12029";
const LIGHT_ORANGE = "#F47920";

// About colors
const DARK_BLUE = "#1C5577";
const LIGHT_BLUE = "#2EC0D1";

// Our Work colors
const DARK_GREEN = "#0E7C3F";
const LIGHT_GREEN = "#8EC640";

// About colors
const DARK_YELLOW = "#BE792A";
const LIGHT_YELLOW = "#FEE468";

interface Route {
  path: string;
  colors: {
    bottomLeft: string;
    topRight: string;
  };
}

const routes: Route[] = [
  { path: "home", colors: { bottomLeft: DARK_ORANGE, topRight: LIGHT_ORANGE } },
  {
    path: "our-work",
    colors: { bottomLeft: DARK_GREEN, topRight: LIGHT_GREEN },
  },
  { path: "about", colors: { bottomLeft: DARK_BLUE, topRight: LIGHT_BLUE } },
  {
    path: "lets-talk",
    colors: { bottomLeft: DARK_YELLOW, topRight: LIGHT_YELLOW },
  },
];

function deriveTransformKey(fromPath: string, toPath: string) {
  return `${fromPath}-to-${toPath}`;
}

function deriveBackgroundImageStyle(fromRoute: Route) {
  const key = `${fromRoute.path}-static`;
  return {
    [key]: {
      backgroundImage: `linear-gradient(45deg, ${fromRoute.colors.bottomLeft} 0%, ${fromRoute.colors.topRight} 33%)`,
    },
  };
}

function deriveAnimationBackgroundImageStyle(fromRoute: Route, toRoute: Route) {
  const key = deriveTransformKey(fromRoute.path, toRoute.path);
  return {
    [key]: {
      backgroundImage: `linear-gradient(45deg, ${toRoute.colors.bottomLeft} 0%, ${toRoute.colors.topRight} 33%, ${fromRoute.colors.bottomLeft} 66%, ${fromRoute.colors.topRight} 100%)`,
    },
  };
}

const backgrounGradientsObj = routes.reduce((memo, fromRoute) => {
  Object.assign(memo, deriveBackgroundImageStyle(fromRoute));
  routes.forEach(toRoute => {
    if (fromRoute.path !== toRoute.path) {
      Object.assign(
        memo,
        deriveAnimationBackgroundImageStyle(fromRoute, toRoute),
      );
    }
  });
  return memo;
}, {});

const useStyles = makeStyles(() => ({
  root: {
    width: "100vw",
    height: "100%",
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundSize: "400%",
  },
  main: {
    width: "100%",
    flexGrow: 1,
  },
  "@keyframes animateBackground": {
    "0%": { backgroundPosition: "100% 100%" },
    "100%": { backgroundPosition: "0% 0%" },
  },
  animateBackground: {
    animation: "$animateBackground 3s forwards",
    animationTimingFunction: "linear",
  },
  backgroundAnimationHelper: {
    backgroundPosition: "100% 100%",
  },
  backgroundStaticHelper: {
    backgroundPosition: "0% 0%",
  },
  footer: {
    marginTop: "auto",
    borderTop: `2px solid ${DARK_GREY}`,
    height: "13vh",
  },
  contactEmail: {
    color: "#fff",
  },
  ...backgrounGradientsObj,
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery(smallScreenMaxBreakpoint);
  let { pathname } = useLocation();
  pathname = pathname.slice(1) || "home";
  const previousPath = usePrevious(pathname);
  const [animatingId, setAnimatingId] = useState(shortid.generate());
  const previousAnimatingId = usePrevious(animatingId);
  const finishedAnimation =
    previousAnimatingId && animatingId !== previousAnimatingId;

  const rootClassNames = [classes.root];
  if (previousPath && !finishedAnimation && previousPath !== pathname) {
    rootClassNames.push(classes.backgroundAnimationHelper);
    rootClassNames.push(
      (classes as any)[deriveTransformKey(previousPath, pathname)],
    );
    rootClassNames.push(classes.animateBackground);
    setTimeout(() => {
      setAnimatingId(shortid.generate());
    }, 3000);
  } else {
    rootClassNames.push(classes.backgroundStaticHelper);
    rootClassNames.push(classes[`${pathname}-static`]);
  }

  const deriveLogoBoxMarginTop = useCallback(() => (isSmallScreen ? 2 : 16), [
    isSmallScreen,
  ]);
  const deriveLogoHeight = useCallback(() => (isSmallScreen ? 60 : 80), [
    isSmallScreen,
  ]);

  return (
    <div key={shortid.generate()} className={clsx(rootClassNames)}>
      <Container maxWidth="md" className={classes.main}>
        {isSmallScreen && <MobileNav />}
        <Box mt={deriveLogoBoxMarginTop()} mb={12}>
          <Grid container item justify="center">
            <Link to="/">
              <Logo height={deriveLogoHeight()} svgColor="white" />
            </Link>
          </Grid>
        </Box>
        {children}
      </Container>
      <Box className={classes.footer}>
        <Box mt={1}>
          <Grid
            container
            item
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Logo height={35} svgColor={DARK_GREY} />
            <Typography
              gutterBottom
              variant="body2"
              className={classes.contactEmail}
            >
              <i>contact@future-days.us</i>
            </Typography>
            <Typography gutterBottom variant="body2">
              <i>&copy;2020 FutureDays Software. All rights reserved.</i>
            </Typography>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default View;
