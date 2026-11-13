import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { t } from '../i18n/strings';
import { routes } from '../routes';

const renderPanel = () =>
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/homes'] })} />);

describe('theme picker', () => {
  it('follows the system theme by default', () => {
    renderPanel();

    expect(screen.getByLabelText(t.theme.label)).toHaveValue('system');
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it('sets and remembers a chosen theme', async () => {
    renderPanel();

    await userEvent.selectOptions(screen.getByLabelText(t.theme.label), 'dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('calico.theme')).toBe('dark');
  });

  it('goes back to the system theme', async () => {
    localStorage.setItem('calico.theme', 'light');
    renderPanel();

    await userEvent.selectOptions(screen.getByLabelText(t.theme.label), 'system');

    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('calico.theme')).toBeNull();
  });
});
