import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import NavButton from "../../components/NavButton";
import BulbIcon from "../../components/BulbIcon";

interface Service {
  title: string;
  description: string;
  performedFor: string;
}

const SERVICES: Service[] = [
  {
    title: 'Software Engineering',
    description: 'You need help on the resource side. Sometimes we encounter a situation where high level or deep understanding of complex processes is needed. We quickly evaluate the context and continuously deliver solutions.',
    performedFor: ['Fortune 500 financial services firm, 20MM global logistics company, 3MM building energy efficiency startup, US based marketing firm']
  },
  {
    title: 'Technical Evaluation',
    description: `It's common for a founder or leader to want to know where they stand. We take a look and take pleasure in answering questions to inform a new roadmap so that you feel comfortable discussing the future.`,
    performedFor: ['3MM building energy efficiency startup, Seed stage measurement hardware firm']
  },
  {
    title: 'Equity Partnership / CTO / Advisor',
    description: `It isn't easy to find a technical co-founder. Equity partnerships provide access to our experience, expertise, and solid development skills. This ensures you worry less about the tech, allowing your leadership to focus on the goals.`,
    performedFor: ['3MM collegiate sports services company']
  },
]

interface Props { }

const useStyles = makeStyles((theme: Theme) => ({
  contrastHeader: {
    color: "white",
    textTransform: "uppercase",
  },
}));

const OurWork: React.FC<Props> = ({ }) => {
  const classes = useStyles();

  const ServiceType = ({ title, description }) => (
    <Grid container justify="center" spacing={2}>
      <Grid item>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
          className={classes.contrastHeader}
        >
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          <i>
            {description}
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
      <Hidden only={["xs", "sm"]}>
        <Grid
          item
          container
          md={2}
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
      <Grid item container xs={12} md={8} justify="center">
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
                We are experienced, clinical generalists offering breadth and depth. We jump into codebases to start knocking out work tickets. We mentor developers while optimizing the product. We partner with startups to lead their technical teams. We do everything because we know how the 0s and 1s work, under the hood.
              </i>
            </Typography>
            <Box mt={2}>
              <Typography variant="body1" align="center" color="textSecondary">
                <i>
                  We make your future days easier.
              </i>
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item>
          <Box mt={8}>
            <ServiceType {...SERVICES[0]} />
          </Box>
          <Box mt={2}>
            <ServiceType {...SERVICES[1]} />
          </Box>
          <Box mt={2} mb={2}>
            <ServiceType {...SERVICES[2]} />
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

export default OurWork;
