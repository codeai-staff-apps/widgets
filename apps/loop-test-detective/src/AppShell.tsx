import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (LinearProgress, Paper, Chip,
// Avatar) that the DS token overrides in theme.css can't reach. `background.
// default` is the app's real page colour, not 'transparent': this app paints
// no background image, so a flat colour here is what CssBaseline needs to
// avoid painting a white body under the panels.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#6A62D9', dark: '#4F47B8', light: '#f0eeff'},
    background: {default: '#f5f5f7', paper: '#ffffff'},
    text: {primary: '#000000', secondary: '#4F4F57'},
    divider: '#e5e5e5',
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
