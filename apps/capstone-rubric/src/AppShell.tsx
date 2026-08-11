import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF'},
    // A real colour, not 'transparent': CssBaseline paints body from this and
    // its injected rule outranks the app stylesheet, so a transparent default
    // silently drops the lavender field.
    background: {default: '#e4e2f8', paper: '#ffffff'},
    text: {primary: '#211c3d', secondary: '#4a457a'},
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
