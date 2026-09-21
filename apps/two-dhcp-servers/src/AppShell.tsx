import {CodeaiTheme} from '@code-dot-org/component-library/themes';
import {ThemeProvider} from '@mui/material/styles';

import {LiveAnnouncerProvider} from './shared';

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={CodeaiTheme}>
      <LiveAnnouncerProvider>{children}</LiveAnnouncerProvider>
    </ThemeProvider>
  );
}
