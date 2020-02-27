import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import View from "./components/View";
import Home from "./views/Home";
import KCollege from "./views/KCollege";

type Props = {};

const Monsterrat = { fontFamily: "Montserrat, sans-serif", fontWeight: 400 };
const LibreBaskerville = {
  fontFamily: "Libre Baskerville, sans-serif",
  fontWeight: 400,
};

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#4CBFFE",
    },
    primary: {
      light: "#cfaa67",
      main: "#4CBFFE",
      dark: "#89682e",
    },
    secondary: {
      light: "#4f4b4c",
      main: "#373733",
      dark: "#181516",
    },
  },
  typography: {
    h1: {
      ...Monsterrat,
    },
    h2: {
      ...Monsterrat,
    },
    h3: {
      ...Monsterrat,
    },
    h4: {
      ...Monsterrat,
    },
    h5: {
      ...Monsterrat,
    },
    h6: {
      ...Monsterrat,
    },
    body1: {
      ...LibreBaskerville,
    },
    body2: {
      ...LibreBaskerville,
    },
    subtitle1: {
      ...Monsterrat,
    },
  },
});

const App: React.FC<Props> = ({}) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <>
          <CssBaseline />
          <View>
            <Switch>
              <Route path="/kalamazoo-college" component={KCollege} />
              <Route path="/" component={Home} />
            </Switch>
          </View>
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
