import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

// Layer 2 — re-theme the plain MUI components (LinearProgress, Paper) that
// the DS token overrides in theme.css can't reach.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {main: '#f0a15f'},
    background: {default: 'transparent', paper: '#2a1734'},
    text: {primary: '#f4ede6', secondary: '#a89aa1'},
  },
  shape: {borderRadius: 12},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      {children}
    </ThemeProvider>
  );
}
