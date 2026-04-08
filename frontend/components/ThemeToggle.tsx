'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      onClick={toggleTheme}
      className="theme-card-elevated inline-flex h-10 w-10 items-center justify-center rounded-full"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
      ) : (
        <Sun className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
      )}
    </button>
  );
}
