import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the MUI parts (Card/Paper/Alert/Avatar) that the DS
// token overrides in theme.css can't reach.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF', dark: '#1F1976', light: '#E4E2F8'},
    background: {default: '#ffffff', paper: '#ffffff'},
    text: {primary: '#1a1a1a', secondary: '#55507A'},
    divider: '#E4E2F8',
  },
  shape: {borderRadius: 10},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
