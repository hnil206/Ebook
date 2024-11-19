'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return null;
  }
  return (
    <button
      // variant="ghost"
      // size="sm"
      // className="h-8 w-8 px-0"
      onClick={toggleTheme}
    >
      <div className="flex items-start gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground">
        {resolvedTheme === 'light' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
        )}
        <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        <span className="sr-only">Toggle theme</span>
      </div>
    </button>
  );
}
