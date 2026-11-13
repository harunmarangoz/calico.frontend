import { Navigate, type RouteObject } from 'react-router';

import { t } from './i18n/strings';
import { NotFound } from './pages/NotFound';
import { Placeholder } from './pages/Placeholder';
import { Layout } from './ui/Layout';

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/homes" replace /> },
      { path: 'homes', element: <Placeholder {...t.homes} /> },
      { path: 'fleet', element: <Placeholder {...t.fleet} /> },
      { path: 'themes', element: <Placeholder {...t.themes} /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
