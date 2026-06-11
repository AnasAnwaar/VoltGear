'use client'

import { useTheme } from '@/providers/Theme'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle color theme"
      className="grid size-9 place-items-center rounded-md text-foreground/70 transition-colors hover:text-foreground"
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </button>
  )
}
