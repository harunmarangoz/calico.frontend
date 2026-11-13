import { icons } from '@harunmarangoz/calico-design';
import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import { Icon } from './Icon';

it('draws the token path, hidden from screen readers', () => {
  const { container } = render(<Icon name="home" />);

  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg.querySelector('path')).toHaveAttribute('d', icons.icons.home);
});
