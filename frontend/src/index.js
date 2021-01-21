import React from 'react';
import ReactDOM from 'react-dom';
import JobBoard from './job_board';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const primaryColor = '#eda52f';
const errorColor = '#d0021b';
const textColor = '#2B2B38';

const themeDefaults = createMuiTheme({
    palette: {
        primary: {
            main: primaryColor,
            dark: primaryColor,
            light: primaryColor,
        },
        secondary: {
            main: primaryColor,
            dark: primaryColor,
            light: primaryColor,
        },
        error: {
            main: errorColor,
            dark: errorColor,
            light: errorColor,
        },
    },
    typography: {
        useNextVariants: true,
        fontFamily: ['Roboto', 'sans-serif'],
        body1: {
            color: textColor,
        },
        body2: {
            color: textColor,
        },
    },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={themeDefaults}>
      <CssBaseline />
      <JobBoard />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
