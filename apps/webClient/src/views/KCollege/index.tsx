import React from "react";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

interface Props {}

const useStyles = makeStyles((theme: Theme) => ({}));

const KCollege: React.FC<Props> = ({}) => {
  return (
    <Typography align="center" variant="h5">
      FutureDays Software needs your help.
    </Typography>
  );
};

export default KCollege;
