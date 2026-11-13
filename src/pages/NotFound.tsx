import { Link } from 'react-router';

import { t } from '../i18n/strings';

export function NotFound() {
  return (
    <section className="stack">
      <h1 className="display-md">{t.notFound.title}</h1>
      <Link to="/homes" className="link label">
        {t.notFound.back}
      </Link>
    </section>
  );
}
