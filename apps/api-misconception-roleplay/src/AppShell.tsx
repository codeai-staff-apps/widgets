import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (Button, Paper, Avatar, Divider)
// that the DS token overrides in theme.css can't reach.
//
// background.default is the app's actual page colour, not 'transparent':
// this app's body paints a flat colour (see roleplay.css), and CssBaseline's
// emotion-injected body rule lands after that stylesheet and wins. 'transparent'
// is only safe when the app's body rule paints a background *image* (e.g. a
// gradient) — a flat colour here would be silently overwritten to white.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF'},
    background: {default: '#f5f5f7', paper: '#ffffff'},
    text: {primary: '#1a1a1a', secondary: '#555555'},
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
