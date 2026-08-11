import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

// Layer 2 — this app imports no MUI components today, but keep the palette
// consistent with the app's identity so any future MUI use inherits it.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#554CB3', dark: '#423B8C', light: '#6A62D9'},
  },
  shape: {borderRadius: 16},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
