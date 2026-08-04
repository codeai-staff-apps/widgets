import '@codeai-staff-apps/runtime/runtime.css';
import React from 'react';
import {createRoot} from 'react-dom/client';

import App from './App';
import AppShell from './AppShell';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <App />
    </AppShell>
  </React.StrictMode>,
);
