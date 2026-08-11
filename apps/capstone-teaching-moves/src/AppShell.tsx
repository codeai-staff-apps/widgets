import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {main: '#4C42CF'},
    // The layer-3 body rule paints a flat colour, not an image, so `default`
    // must be that real colour — CssBaseline's emotion-injected rule lands
    // after our stylesheet and would silently blank a `transparent` default.
    background: {default: '#E4E2F8', paper: '#ffffff'},
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
