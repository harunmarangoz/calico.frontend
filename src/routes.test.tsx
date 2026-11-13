import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { t } from './i18n/strings';
import { routes } from './routes';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('routes', () => {
  it('opens on homes', async () => {
    const router = renderAt('/');

    expect(await screen.findByRole('heading', { name: t.homes.title })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/homes');
    expect(screen.getByRole('link', { name: t.nav.homes })).toHaveAttribute('aria-current', 'page');
  });

  it('moves between sections from the sidebar', async () => {
    renderAt('/homes');

    await userEvent.click(screen.getByRole('link', { name: t.nav.fleet }));

    expect(await screen.findByRole('heading', { name: t.fleet.title })).toBeInTheDocument();
  });

  it('shows not found for an unknown path', async () => {
    renderAt('/nowhere');

    expect(await screen.findByRole('heading', { name: t.notFound.title })).toBeInTheDocument();
  });
});
