import React from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FlareIcon from "@material-ui/icons/Flare";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const About: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Hidden only="xs">
        <Grid item sm={2}>
          <NavButton
            route="/our-work"
            text="our work"
            isVertical={true}
            isLeft={true}
          />
        </Grid>
      </Hidden>
      <Grid item container sm={8} justify="center">
        <Grid item>
          <Typography
            gutterBottom
            variant="h5"
            className={classes.contrastHeader}
          >
            about us
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <Box maxWidth="75%">
            <Typography variant="body1" align="center" color="textSecondary">
              <i>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Auctor elit sed vulputate mi. Orci eu lobortis elementum nibh
                tellus molestie nunc non blandit. Mi in nulla posuere
                sollicitudin aliquam ultrices sagittis.
              </i>
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Grid container item justify="center">
              <FlareIcon fontSize="large" />
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={12}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    align="center"
                    className={classes.contrastHeader}
                  >
                    partner name
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="textSecondary"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography
                    gutterBottom
                    variant="h5"
                    align="center"
                    className={classes.contrastHeader}
                  >
                    partner name
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="textSecondary"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Hidden only="xs">
        <Grid item container sm={2} justify="flex-end" alignItems="flex-start">
          <NavButton route="/about" text="about us" isVertical={true} />
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default About;
