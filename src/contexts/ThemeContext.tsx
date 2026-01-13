import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark'; // Enforce dark theme

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always default to dark
  const [theme] = useState<Theme>('dark');

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.add('dark');
    // Ensure light class is removed
    root.classList.remove('light');
    
    // Save to localStorage just in case, though we ignore it now
    localStorage.setItem('task-tracker-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // No-op: Theme is locked to dark
  };

  const setTheme = () => {
     // No-op
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
