import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (LinearProgress, Paper, Chip)
// that the DS token overrides in theme.css can't reach.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {main: '#6a62d9'},
    success: {main: '#10b981'},
    error: {main: '#ef4444'},
    warning: {main: '#fbbf24'},
    // `background` is transparent, not the page ground colour, because
    // app.css paints the ground with a gradient image (see the trap note
    // in THEMING.md) — an image survives a transparent background-color.
    background: {default: 'transparent', paper: '#12112a'},
    text: {primary: '#e2e8f0', secondary: '#94a3b8'},
  },
  shape: {borderRadius: 14},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
