import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FlareIcon from "@material-ui/icons/Flare";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Logo from "../../components/Logo/";
import NavButton from "../../components/NavButton";

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
    <Box pt={16} height="100vh">
      <Grid container justify="center">
        <Link to="/">
          <Logo />
        </Link>
      </Grid>
      <Box mt={12}>
        <Grid container>
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
          <Grid item container sm={8} justify="center">
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
              <Box width="50%">
                <Box>
                  <Typography
                    variant="body1"
                    align="center"
                    color="textSecondary"
                  >
                    <i>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed consectetuer adipscing
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
              </Box>
            </Grid>
            <Grid item>
              <Box mt={2}>
                <Grid container item justify="center">
                  <FlareIcon fontSize="large" />
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid
            item
            container
            sm={2}
            justify="flex-end"
            alignItems="flex-start"
          >
            <NavButton route="/about" text="about us" isVertical={true} />
          </Grid>
        </Grid>
      </Box>
      <Box mt={6}>
        <Grid container justify="center">
          <NavButton route="/lets-talk" text="let's talk" />
        </Grid>
      </Box>
    </Box>
  );
};

export default LetsTalk;
