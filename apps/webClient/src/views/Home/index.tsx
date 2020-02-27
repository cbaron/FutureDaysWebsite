import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {}

const logo = `${process.env.PUBLIC_BUCKET}/fd-logo.png`;

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    height: "100px",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
  },
  middleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "80px",
  },
  lowerContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "80px",
  },
  heroContainer: {
    maxWidth: "300px",
  },
  bodyText: {
    color: theme.palette.secondary.main,
    textAlign: "center",
    fontStyle: "italic",
  },
  aboutUsButton: {
    backgroundColor: "white",
    borderRadius: 0,
    width: "60px",
    height: "200px",
  },
  ourWorkButton: {
    backgroundColor: "transparent",
    borderRadius: 0,
    border: "solid 4px white",
    width: "60px",
    height: "200px",
  },
  aboutButtonText: {
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontWeight: 500,
  },
  ourWorkButtonText: {
    // Need to swap facing direction
    writingMode: "vertical-rl",
    textOrientation: "sideways",
    fontWeight: 500,
  },
  partnerCard: {
    maxWidth: "300px",
    textAlign: "center",
  },
  heroHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    color: "white",
    marginBottom: "10px",
  },
  whiteTitle: {
    color: "white",
    fontWeight: 500,
    marginBottom: "10px",
  },
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <Grid container style={{ margin: "8rem 0" }}>
      <Grid item md xs></Grid>
      <Grid item md={6} xs={10} lg={7}>
        <Box className={classes.logoContainer}>
          <img src={logo} alt="Future Days" className={classes.logo} />
        </Box>
        <Box className={classes.middleContainer}>
          <Button className={classes.ourWorkButton}>
            <Typography variant="h6" className={classes.ourWorkButtonText}>
              ABOUT US
            </Typography>
          </Button>
          <Box className={classes.heroContainer}>
            <Typography variant="h4" className={classes.heroHeader}>
              <Typography variant="body1">03.</Typography>ABOUT US
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor
              elit sed vulputate mi. Orci eu lobortis elementum nibh tellus
              molestie nunc non blandit. Mi in nulla posuere sollicitudin
              aliquam ultrices sagittis.
            </Typography>
          </Box>
          <Button className={classes.aboutUsButton}>
            <Typography variant="h6" className={classes.aboutButtonText}>
              ABOUT US
            </Typography>
          </Button>
        </Box>
        <Box className={classes.lowerContainer}>
          <Box className={classes.partnerCard}>
            <Typography variant="h5" className={classes.whiteTitle}>
              PARTNER NAME
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              sitame etel
            </Typography>
          </Box>
          <Box className={classes.partnerCard}>
            <Typography variant="h5" className={classes.whiteTitle}>
              PARTNER NAME
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              sitame etel
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item md xs></Grid>
    </Grid>
  );
};

export default Home;
