import '@harunmarangoz/calico-design/fonts.css';
import '@harunmarangoz/calico-design/tokens.css';
import './app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { routes } from './routes';
import { applyTheme, storedTheme } from './ui/theme';

// Before the first paint, so a stored dark theme doesn't flash light.
applyTheme(storedTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routes)} />
  </StrictMode>,
);
