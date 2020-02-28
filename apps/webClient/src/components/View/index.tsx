import React from "react";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

interface Props {
  children: React.ReactNode;
}

const LIGHT_BLUE = "#4CBFFE";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100vw",
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "scroll",
  },
  pageWrapper: {
    backgroundColor: LIGHT_BLUE,
    height: "100%",
  },
  pageContainer: {
    padding: 0,
  },
}));

const View: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Box className={classes.pageWrapper}>
          <Container maxWidth="md" className={classes.pageContainer}>
            {children}
          </Container>
        </Box>
      </main>
    </div>
  );
};

export default View;
