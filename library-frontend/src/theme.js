import { createTheme } from '@mui/material/styles';

// A palette inspired by library ledgers and reading-lamp brass rather than
// the default MUI blue: deep ink navy, warm brass accent, and a soft paper
// background. Data-heavy areas (ISBNs, dates, counts) use a monospace face
// to read like catalog entries.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2A45',
      light: '#3B4A6B',
      dark: '#121A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B9843F',
      light: '#D3A768',
      dark: '#8C6329',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F4EF',
      paper: '#FFFFFF',
    },
    success: {
      main: '#2F9E6E',
    },
    warning: {
      main: '#E08E32',
    },
    error: {
      main: '#C6483C',
    },
    info: {
      main: '#3B6E91',
    },
    text: {
      primary: '#1B2130',
      secondary: '#5B6472',
    },
    divider: '#E4E0D6',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E4E0D6',
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#F6F4EF',
        },
      },
    },
  },
});

export default theme;
