import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as shortid from "shortid";
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
      backgroundImage: `linear-gradient(45deg, ${fromRoute.colors.bottomLeft} 0%, ${fromRoute.colors.topRight} 100%)`,
    },
  };
}

function deriveAnimationBackgroundImageStyle(fromRoute: Route, toRoute: Route) {
  const key = deriveTransformKey(fromRoute.path, toRoute.path);
  return {
    [key]: {
      backgroundImage: `linear-gradient(45deg, ${toRoute.colors.bottomLeft} 0%, ${toRoute.colors.topRight} 33%, ${fromRoute.colors.topRight} 66%, ${fromRoute.colors.bottomLeft} 100%)`,
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
  },
  main: {
    width: "100%",
    flexGrow: 1,
  },
  "@keyframes animateBackground": {
    "0%": { backgroundPosition: "66% 66%" },
    "50%": { backgroundPosition: "33% 33%" },
    "100%": { backgroundPosition: "0% 0%" },
  },
  animateBackground: {
    animation: "$animateBackground 2s forwards",
  },
  backgroundAnimationHelper: {
    backgroundPosition: "66% 66%",
    backgroundSize: "400%",
  },
  backgroundStaticHelper: {
    backgroundPosition: "0% 0%",
    backgroundSize: "100%",
  },
  ...backgrounGradientsObj,
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
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
    }, 2000);
  } else {
    rootClassNames.push(classes.backgroundStaticHelper);
    rootClassNames.push(classes[`${pathname}-static`]);
  }

  return (
    <>
      <div key={shortid.generate()} className={clsx(rootClassNames)}>
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
    </>
  );
};

export default View;
