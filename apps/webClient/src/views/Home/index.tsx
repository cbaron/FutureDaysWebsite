import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
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
          <Grid item container sm={3} justify="flex-start">
            <NavButton route="ourwork" text="our work" />
          </Grid>
          <Grid item container sm={6} justify="center">
            <Container maxWidth="xs">
              <Grid container justify="center" alignItems="center">
                <Typography variant="body1">03.</Typography>
                <Typography
                  gutterBottom
                  variant="h4"
                  className={classes.contrastHeader}
                >
                  about us
                </Typography>
              </Grid>
              <Typography variant="body1" align="center" color="textSecondary">
                <i>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Auctor elit sed vulputate mi. Orci eu lobortis elementum nibh
                  tellus molestie nunc non blandit. Mi in nulla posuere
                  sollicitudin aliquam ultrices sagittis.
                </i>
              </Typography>
            </Container>
          </Grid>
          <Grid item container sm={3} justify="flex-end">
            <NavButton route="about" text="about us" />
          </Grid>
        </Grid>
      </Box>
      <Box mt={12}>
        <Grid container justify="space-around">
          <Container maxWidth="xs">
            <Typography
              variant="h5"
              align="center"
              className={classes.contrastHeader}
              gutterBottom
            >
              partner name
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              <i>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                sitame etel
              </i>
            </Typography>
          </Container>
          <Container maxWidth="xs">
            <Typography
              variant="h5"
              align="center"
              className={classes.contrastHeader}
              gutterBottom
            >
              partner name
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              <i>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                sitame etel
              </i>
            </Typography>
          </Container>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
