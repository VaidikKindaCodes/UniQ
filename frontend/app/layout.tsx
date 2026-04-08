import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import GlobalHooks from "./components/GlobalHooks";
import AppToaster from "./components/AppToaster";

export const metadata = {
  title: "Uniq",
  description: "Campus Online Queue & Reservation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeBootScript = `
    (function () {
      try {
        var storageKey = 'campusor-theme';
        var savedTheme = window.localStorage.getItem(storageKey);
        var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var theme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme;
        var root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      } catch (error) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="theme-page">
        <ThemeProvider>
          <AuthProvider>
            <GlobalHooks />
            {children}
            <AppToaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
