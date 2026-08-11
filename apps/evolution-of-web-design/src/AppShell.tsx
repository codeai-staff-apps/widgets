import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the plain MUI components (CssBaseline) that the DS token
// overrides in theme.css can't reach. This app has no MUI-only structural
// components (Paper/Card/Stack); this exists purely to install CssBaseline
// with the light background theme.css and app.css assume.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF'},
    background: {default: '#ffffff', paper: '#ffffff'},
    text: {primary: '#222222', secondary: '#4a457a'},
  },
  shape: {borderRadius: 8},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
