import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (Paper, Alert's palette lookup)
// that the DS token overrides in theme.css can't reach on their own.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#6c63ff', dark: '#4f46e5', light: '#e0e7ff'},
    success: {main: '#16a34a'},
    warning: {main: '#f97316'},
    error: {main: '#ff6b6b'},
    background: {default: '#f0f4ff', paper: '#ffffff'},
    text: {primary: '#1e1b4b', secondary: '#545a72'},
  },
  shape: {borderRadius: 10},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
