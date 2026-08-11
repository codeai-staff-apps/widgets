import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';

// Layer 2 — re-theme the MUI Card, which the DS token overrides in
// theme.css can't reach (MUI has its own palette).
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {main: '#00ffff'},
    secondary: {main: '#ff00ff'},
    // The page ground must be a real colour here, not 'transparent':
    // CssBaseline paints body from background.default, and a transparent
    // body would let the white canvas through under the console panel.
    background: {default: '#1a1a2e', paper: '#0b0b13'},
    text: {primary: '#00ff00', secondary: '#00ffff'},
  },
  shape: {borderRadius: 8},
});

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme={false} />
      {children}
    </ThemeProvider>
  );
}
