import React, { ReactNode, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { NavLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  children: ReactNode;
}

const GRAY = "#23221C";

const useStyles = makeStyles(theme => ({
  navDrawer: {
    height: "100vh",
    background: GRAY,
  },
  navLinkLabel: {
    textTransform: "uppercase",
    color: "white",
  },
  listItemTop: {
    borderTop: "3px solid white",
    borderBottom: "3px solid white",
  },
  listItem: {
    borderBottom: "3px solid white",
  },
  navCloseButton: {
    right: 16,
    top: -8,
    color: "white",
    marginBottom: 60,
  },
}));

const navLinks = [
  { path: "/our-work", label: "Our Work" },
  { path: "/about", label: "About Us" },
  { path: "/lets-talk", label: "Let's Talk" },
];

const MobileNav: React.FC<Props> = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleDrawer = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const renderNavLink = (link, index) => {
    const classWithBorder =
      index === 0 ? classes.listItemTop : classes.listItem;
    return (
      <ListItem button key={link.label} className={classWithBorder}>
        <ListItemText>
          <Link component={NavLink} color="secondary" to={link.path}>
            <Typography
              align="center"
              color="secondary"
              variant="h6"
              className={classes.navLinkLabel}
            >
              {link.label}
            </Typography>
          </Link>
        </ListItemText>
      </ListItem>
    );
  };

  return (
    <>
      <Grid container item justify="flex-end">
        <Button onClick={toggleDrawer}>
          <MenuIcon fontSize="large" />
        </Button>
      </Grid>
      <Drawer anchor="top" open={isMobileNavOpen} onClose={toggleDrawer}>
        <List
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          className={classes.navDrawer}
        >
          <Grid container item justify="flex-end">
            <Button onClick={toggleDrawer} className={classes.navCloseButton}>
              <CloseIcon fontSize="large" />
            </Button>
          </Grid>
          {navLinks.map((navLink, index) => renderNavLink(navLink, index))}
        </List>
      </Drawer>
    </>
  );
};

export default MobileNav;
