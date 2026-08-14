import {ToastProvider} from '@code-dot-org/component-library/toast';
import {CodeaiTheme} from '@code-dot-org/component-library/themes';
import {ThemeProvider} from '@mui/material/styles';

export default function AppShell({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={CodeaiTheme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
