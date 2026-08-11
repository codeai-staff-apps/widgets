import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (Card, Divider) that the DS
// token overrides in theme.css can't reach. The page is flat white with no
// background image, so background.default must be the real page colour —
// CssBaseline's emotion-injected body rule lands after our stylesheet and
// would otherwise leave a bare white body under a mismatched theme.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF'},
    background: {default: '#ffffff', paper: '#ffffff'},
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
