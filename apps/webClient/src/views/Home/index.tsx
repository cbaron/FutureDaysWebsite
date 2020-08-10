import React from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";
import SunBurstIcon from "../../components/SunBurstIcon";

interface Props { }

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const Home: React.FC<Props> = ({ }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Hidden only={["xs", "sm"]}>
          <Grid item md={2}>
            <NavButton
              route="/our-work"
              text="our work"
              isVertical={true}
              isLeft={true}
            />
          </Grid>
        </Hidden>
        <Grid item container xs={12} md={8} justify="center">
          <Grid item>
            <Typography
              gutterBottom
              variant="h5"
              className={classes.contrastHeader}
            >
              oh, hello
            </Typography>
          </Grid>
          <Grid item container justify="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" align="center" color="textSecondary">
                <i>
                  FutureDays is an earth based technical consulting shop specializing in software.
                  We partner with firms to formulate a technical strategy, to augment engineering resources,
                  and to build scalable solutions.
                </i>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Box mt={2}>
              <Grid container item justify="center">
                <SunBurstIcon />
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Hidden only={["xs", "sm"]}>
          <Grid item container md={2} justify="flex-end">
            <NavButton route="/about" text="about us" isVertical={true} />
          </Grid>
        </Hidden>
      </Grid>
      <Hidden only={["xs", "sm"]}>
        <Box mt={12}>
          <Grid item container justify="center">
            <NavButton route="/lets-talk" text="let's talk" />
          </Grid>
        </Box>
      </Hidden>
    </>
  );
};

export default Home;
