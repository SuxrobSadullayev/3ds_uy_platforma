'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Initial theme detection from localStorage or HTML class
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      if (saved === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Default to dark mode for rich aesthetics
      document.documentElement.classList.add('dark')
      setTheme('dark')
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm hover:bg-muted transition-all active:scale-95"
      title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
      aria-label={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'u rejimga o'tish"}
    >
      {theme === 'dark' ? (
        <Sun className="size-4 text-amber-400 animate-in spin-in-90 duration-300" aria-hidden="true" />
      ) : (
        <Moon className="size-4 text-indigo-500 animate-in spin-in-90 duration-300" aria-hidden="true" />
      )}
    </button>
  )
}
