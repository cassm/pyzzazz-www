import {createTheme} from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#750027',
    },
    secondary: {
      main: '#00b983',
    }
  },
  typography: {
    fontFamily: ["LEMON MILK", "sans-serif"].join(',')
  }
});