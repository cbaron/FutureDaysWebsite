import React from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";
import BulbIcon from "../../components/BulbIcon";

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const OurWork: React.FC<Props> = ({}) => {
  const classes = useStyles();

  const ServiceType = () => (
    <Grid container justify="center" spacing={2}>
      <Grid item>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
          className={classes.contrastHeader}
        >
          service type
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          <i>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor
            elit sed vulputate mi. Orci eu lobortis elementum nibh tellus
            molestie nunc non blandit.
          </i>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          <i>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Auctor
            elit sed vulputate mi.
          </i>
        </Typography>
      </Grid>
      <Grid item>
        <Grid container item justify="center">
          <BulbIcon />
        </Grid>
      </Grid>
    </Grid>
  );

  return (
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
            our work
          </Typography>
        </Grid>
        <Grid item container justify="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" align="center" color="textSecondary">
              <i>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Auctor elit sed vulputate mi. Orci eu lobortis elementum nibh
                tellus molestie nunc non blandit. Mi in nulla posuere
                sollicitudin aliquam ultrices sagittis.
              </i>
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Box mt={2} mb={4}>
            <Grid container item justify="center">
              <BulbIcon />
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <ServiceType />
          </Box>
          <Box mt={2}>
            <ServiceType />
          </Box>
          <Box mt={2} mb={2}>
            <ServiceType />
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

export default OurWork;
