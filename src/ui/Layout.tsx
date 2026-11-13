import { NavLink, Outlet } from 'react-router';

import { t } from '../i18n/strings';
import { Icon, type IconName } from './Icon';
import { useThemeChoice, type ThemeChoice } from './theme';

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: '/homes', label: t.nav.homes, icon: 'home' },
  { to: '/fleet', label: t.nav.fleet, icon: 'devices' },
  { to: '/themes', label: t.nav.themes, icon: 'scenes' },
];

const THEMES: ThemeChoice[] = ['system', 'light', 'dark'];

/** The panel frame: sidebar navigation (surface-sunken) and the page on surface. */
export function Layout() {
  const [theme, setTheme] = useThemeChoice();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="display-md">{t.appName}</span>
          <span className="caption muted">{t.panel}</span>
        </div>
        <nav aria-label={t.panel}>
          <ul className="nav">
            {NAV.map(item => (
              <li key={item.to}>
                <NavLink to={item.to} className="nav-link label">
                  <Icon name={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <label className="theme-picker caption">
          {t.theme.label}
          <select
            className="body-sm"
            value={theme}
            onChange={event => setTheme(event.target.value as ThemeChoice)}>
            {THEMES.map(choice => (
              <option key={choice} value={choice}>
                {t.theme[choice]}
              </option>
            ))}
          </select>
        </label>
      </aside>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
