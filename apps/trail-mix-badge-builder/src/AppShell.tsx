import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — re-theme the MUI parts (Card, Chip) that the DS token overrides
// in theme.css can't reach (MUI has its own palette).
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#6B8E23'},
    // A real colour, not 'transparent': the kraft fleck gradients in app.css
    // are tiny, sparse dots, not a full-bleed image, so CssBaseline's
    // emotion-injected background-color (which lands after our stylesheet
    // and would otherwise win) must resolve to the actual oat ground colour.
    background: {default: '#EDE0C8', paper: '#FFFDF6'},
    text: {primary: '#4A2C1F', secondary: '#5C3D2E'},
  },
  shape: {borderRadius: 12},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
