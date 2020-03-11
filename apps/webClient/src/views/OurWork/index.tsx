import React from "react";
import { makeStyles } from "@material-ui/styles";
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
        <Box mt={2}>
          <Grid container item justify="center">
            <FlareIcon fontSize="large" />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );

  return (
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
              our work
            </Typography>
          </Grid>
          <Grid item container justify="center">
            <Box width="50%">
              <Typography variant="body1" align="center" color="textSecondary">
                <i>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
            <Box mt={8}>
              <ServiceType />
            </Box>
            <Box mt={8}>
              <ServiceType />
            </Box>
            <Box mt={8} mb={8}>
              <ServiceType />
            </Box>
          </Grid>
        </Grid>
        <Grid item container sm={2} justify="flex-end" alignItems="flex-start">
          <NavButton route="/about" text="about us" isVertical={true} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OurWork;
