import {CodeaiTheme} from '@code-dot-org/component-library/themes';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — CodeaiTheme's MUI primary (#4C42CF) isn't this app's purple, so
// MUI-only parts (Card, CardActionArea ripples/outlines) wouldn't match the
// hero. Repoint just the primary colour and the corner radius.
const theme = createTheme(CodeaiTheme, {
  palette: {primary: {main: '#4C2889'}},
  shape: {borderRadius: 16},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
