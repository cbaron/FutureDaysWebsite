import React from "react";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Logo from "../../components/Logo";

interface Props {}

const backgroundImage = `${process.env.PUBLIC_BUCKET}/fd-home.jpg`;

const useStyles = makeStyles((theme: Theme) => ({
  contentWrapper: {
    width: 176
  },
  top: {
    backgroundImage: `url("${backgroundImage}")`,
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "black",
    "&::after": {
      content: "''",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: "absolute",
      width: "100%",
      height: "100%",
      opacity: 1
    }
  },
  futuredays: {
    color: "white"
  },
  titleContent: {
    alignSelf: "flex-end",
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return (
    <Grid container direction="row-reverse" className={classes.top}>
      <Grid item className={classes.titleContent} sm={4} xs="auto">
        <Box pb={2} className={classes.contentWrapper}>
          <Logo fill="white" heightMultiplier={4} />
          <Typography
            className={classes.futuredays}
            align="center"
            variant="h5"
          >
            FutureDays
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
