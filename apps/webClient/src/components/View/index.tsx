import React from "react";
import { makeStyles } from "@material-ui/styles";

interface Props {
  children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  main: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "scroll"
  }
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default View;
