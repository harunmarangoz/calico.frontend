import { expect, it } from 'vitest';

import { t } from './strings';

it('never names the platform the box runs on', () => {
  expect(JSON.stringify(t)).not.toMatch(/home assistant/i);
});
