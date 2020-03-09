import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FlareIcon from "@material-ui/icons/Flare";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Logo from "../../components/Logo/";
import NavButton from "../../components/NavButton";

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  partnerCard: {
    maxWidth: 300,
    textAlign: "center",
  },
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <Box pt={16}>
      <Grid container justify="center">
        <Logo />
      </Grid>
      <Box mt={12}>
        <Grid container>
          <Grid item container sm={4} justify="flex-start">
            <NavButton
              route="our-work"
              text="our work"
              vertical={true}
              isLeft={true}
            />
          </Grid>
          <Grid item container sm={4} justify="center">
            <Grid item container justify="center" alignItems="center">
              <Typography
                gutterBottom
                variant="h4"
                className={classes.contrastHeader}
              >
                oh hello
              </Typography>
            </Grid>
            <Typography variant="body1" align="center" color="textSecondary">
              <i>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Auctor elit sed vulputate mi. Orci eu lobortis elementum nibh
                tellus molestie nunc non blandit. Mi in nulla posuere
                sollicitudin aliquam ultrices sagittis.
              </i>
            </Typography>
            <Box mt={2}>
              <Grid container item justify="center">
                <FlareIcon fontSize="large" />
              </Grid>
            </Box>
          </Grid>
          <Grid item container sm={4} justify="flex-end">
            <NavButton route="about" text="about us" vertical={true} />
          </Grid>
        </Grid>
      </Box>
      <Box mt={6}>
        <Grid container justify="center">
          <NavButton route="lets-talk" text="let's talk" />
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
