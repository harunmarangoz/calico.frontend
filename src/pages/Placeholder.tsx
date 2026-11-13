import { t } from '../i18n/strings';

/** A section whose cloud service is not built yet (Faz 2: KED-275, KED-276, KED-280). */
export function Placeholder({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="stack">
      <h1 className="display-md">{title}</h1>
      <p className="body muted">{intro}</p>
      <div className="card body">{t.notYet}</div>
    </section>
  );
}
