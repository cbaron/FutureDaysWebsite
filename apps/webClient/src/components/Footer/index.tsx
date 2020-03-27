import React from "react";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Logo from "../Logo";

interface Props {}

const DARK_GREY = "#23221C";

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: `2px solid ${DARK_GREY}`,
  },
  contactEmail: {
    color: "#fff",
  },
}));

const NavButton: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer} pt={1} pb={1}>
      <Grid
        container
        item
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Logo height={35} color={DARK_GREY} />
        <Typography
          gutterBottom
          variant="body2"
          className={classes.contactEmail}
        >
          <i>contact@future-days.us</i>
        </Typography>
        <Typography gutterBottom variant="body2">
          <i>
            &copy;{new Date().getFullYear()} FutureDays Software. All rights
            reserved.
          </i>
        </Typography>
      </Grid>
    </Box>
  );
};

export default NavButton;
