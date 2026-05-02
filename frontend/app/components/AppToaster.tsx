'use client';

import { Toaster } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export default function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
    />
  );
}
