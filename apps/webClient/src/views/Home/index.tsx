import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {}

const backgroundImage = `${process.env.PUBLIC_BUCKET}/fd-home.png`;

const useStyles = makeStyles((theme: Theme) => ({
  top: {
    backgroundImage: `url("${backgroundImage}")`,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  }
}));

const Home: React.FC<Props> = ({}) => {
  const classes = useStyles();

  return <div className={classes.top}></div>;
};

export default Home;
