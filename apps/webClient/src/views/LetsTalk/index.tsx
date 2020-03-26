import React from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";
import GlobeIcon from "../../components/GlobeIcon";

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const LetsTalk: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Hidden only="xs">
          <Grid
            item
            container
            sm={2}
            justify="flex-start"
            alignItems="flex-start"
          >
            <NavButton
              route="/our-work"
              text="our work"
              isVertical={true}
              isLeft={true}
            />
          </Grid>
        </Hidden>
        <Grid item container xs={12} sm={8} justify="center">
          <Grid item>
            <Typography
              gutterBottom
              variant="h5"
              className={classes.contrastHeader}
            >
              let's talk
            </Typography>
          </Grid>
          <Grid item container justify="center">
            <Grid item xs={10} sm={6}>
              <Box>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  <i>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    consectetuer adipscing
                  </i>
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  <i>Phone (888) -222-3333</i>
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  <i>Chat@FutureDays.com</i>
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  <i>
                    FutureDaysHQ <br />
                    222 Main Street, City, State
                    <br />
                    ZIP CODE
                  </i>
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item>
            <Box mt={2}>
              <Grid container item justify="center">
                <GlobeIcon />
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Hidden only="xs">
          <Grid item container sm={2} justify="flex-end">
            <NavButton route="/about" text="about us" isVertical={true} />
          </Grid>
        </Hidden>
      </Grid>
      <Hidden only="xs">
        <Box mt={6}>
          <Grid container justify="center">
            <NavButton route="/lets-talk" text="let's talk" />
          </Grid>
        </Box>
      </Hidden>
    </>
  );
};

export default LetsTalk;
