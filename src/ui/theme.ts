import { useEffect, useState } from 'react';

export type ThemeChoice = 'system' | 'light' | 'dark';

const KEY = 'calico.theme';

/**
 * tokens.css follows the system theme until <html data-theme> is set; this keeps the user's
 * choice in localStorage and on that attribute.
 */
export function applyTheme(choice: ThemeChoice) {
  if (choice === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
}

export function storedTheme(): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function useThemeChoice(): [ThemeChoice, (choice: ThemeChoice) => void] {
  const [choice, setChoice] = useState<ThemeChoice>(storedTheme);

  useEffect(() => {
    applyTheme(choice);
    try {
      if (choice === 'system') {
        localStorage.removeItem(KEY);
      } else {
        localStorage.setItem(KEY, choice);
      }
    } catch {
      // Private mode or blocked storage: the choice lasts until the tab closes.
    }
  }, [choice]);

  return [choice, setChoice];
}
