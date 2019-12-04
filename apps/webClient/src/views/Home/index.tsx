import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Logo from "../../components/Logo";

interface Props {}

const backgroundImage = `${process.env.PUBLIC_BUCKET}/fd-home.jpg`;
const nextToHelloImage = `${process.env.PUBLIC_BUCKET}/next-to-hello.jpg`;

const useStyles = makeStyles((theme: Theme) => ({
  contentWrapper: {
    paddingBottom: 0,
    width: 176
  },
  top: {
    backgroundImage: `url("${backgroundImage}")`,
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "black"
  },
  futuredays: {
    color: "white",
    lineHeight: 1
  },
  titleContent: {
    alignSelf: "flex-end",
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.only("xs")]: {
      backgroundColor: "black",
      borderRadius: theme.spacing(2),
      marginRight: 0
    }
  }
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only("xs"));
  const contentColor = "white";

  return (
    <Grid container direction="row-reverse" className={classes.top}>
      <Grid item className={classes.titleContent} sm={3}>
        <Box pb={2} className={classes.contentWrapper}>
          <Logo fill={contentColor} />
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
