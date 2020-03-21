import React from "react";
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
function deriveBackgroundImageStyle(fromRoute: Route, toRoute: Route) {
  const key = deriveTransformKey(fromRoute.path, toRoute.path);
  return {
    [key]: {
      backgroundImage: `linear-gradient(45deg, ${toRoute.colors.bottomLeft} 0%, ${toRoute.colors.topRight} 33%, ${fromRoute.colors.topRight} 66%, ${fromRoute.colors.bottomLeft} 100%)`,
    },
  };
}

const backgrounGradientsObjReduced = routes.reduce((memo, fromRoute) => {
  routes.forEach(toRoute => {
    if (fromRoute.path !== toRoute.path) {
      Object.assign(memo, deriveBackgroundImageStyle(fromRoute, toRoute));
    }
  });
  return memo;
}, {});

const backgrounGradientsObj = {};
routes.forEach(from => {
  routes.forEach(to => {
    if (from.path === to.path) return;
    Object.assign(backgrounGradientsObj, deriveBackgroundImageStyle(from, to));
  });
});

console.log(backgrounGradientsObj);

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
  "@keyframes animateBackground": {
    "0%": { backgroundPosition: "66% 66%" },
    "50%": { backgroundPosition: "33% 33%" },
    "100%": { backgroundPosition: "0% 0%" },
  },
  animateBackground: {
    animation: "$animateBackground 5s forwards",
  },
  backgroundAnimationHelper: {
    backgroundPosition: "66% 66%",
    backgroundSize: "800%",
  },
  ...backgrounGradientsObj,
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
  let { pathname } = useLocation();
  pathname = pathname.slice(1) || "home";
  const previousPath = usePrevious(pathname);

  const rootClassNames = [classes.root, classes.backgroundAnimationHelper];
  if (previousPath) {
    rootClassNames.push(
      (classes as any)[deriveTransformKey(previousPath, pathname)],
    );
    rootClassNames.push(classes.animateBackground);
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
