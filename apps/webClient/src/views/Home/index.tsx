import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {}

const logo = `${process.env.PUBLIC_BUCKET}/fd-logo.png`;

const useStyles = makeStyles((theme: Theme) => ({
  bodyText: {
    color: theme.palette.secondary.main,
  },
  logo: {
    height: "100px",
  },
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item md xs></Grid>
      <Grid item md={6} xs={10}>
        <img src={logo} alt="Future Days" className={classes.logo} />
        <Typography variant="h4">ABOUT US</Typography>
        <Typography variant="body1" className={classes.bodyText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor
          elit sed vulputate mi. Orci eu lobortis elementum nibh tellus molestie
          nunc non blandit. Mi in nulla posuere sollicitudin aliquam ultrices
          sagittis. Interdum posuere lorem ipsum dolor sit. Nunc sed blandit
          libero volutpat sed cras. Pharetra vel turpis nunc eget lorem dolor.
          Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at.
          Magna fermentum iaculis eu non diam phasellus vestibulum. Nulla
          pellentesque dignissim enim sit. In aliquam sem fringilla ut morbi
          tincidunt augue interdum.
        </Typography>
      </Grid>
      <Grid item md xs></Grid>
    </Grid>
  );
};

export default Home;
