import React from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";
import PeopleIcon from "../../components/PeopleIcon";
import { Link } from '@material-ui/core';

const LINKED_IN_URL = 'https://www.linkedin.com/in/futuredays/';

interface Props { }

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
  link: {
  }
}));

const About: React.FC<Props> = ({ }) => {
  const classes = useStyles();

  return (
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
      <Grid item container md={8} justify="center">
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
          <Grid item xs={12} sm={6}>
            <Box mt={4}>
              <Typography variant="body1" align="center" color="textSecondary">
                <i>
                  FutureDays is lead by
              </i>{' '}
                <Link className={classes.link}
                  href={LINKED_IN_URL}
                  underline="hover"
                  color="textSecondary"
                  rel="noopener"
                  target="_blank"
                >Chris Baron</Link>{' '}
                <i>who has been writing single page web applications for a decade and a half.
                Working with teams ranging from startups to enterprise to academia to starting startups, Chris has encountered and produced solutions a countless number of times.
                These include getting mobile applications to look correct across devices all the way up to scaling a chat room up to handle .5 million users at a time.
              He is supported by his loose network of engineers from various backgrounds along with a small team of junior and senior developers.</i>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item>
          <Box mt={2}>
            <Grid container item justify="center">
              <PeopleIcon />
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Hidden only={["xs", "sm"]}>
        <Grid item container md={2} justify="flex-end" alignItems="flex-start">
          <NavButton route="/about" text="about us" isVertical={true} />
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default About;
