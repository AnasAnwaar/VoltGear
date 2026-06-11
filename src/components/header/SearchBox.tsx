'use client'

import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const SearchBox = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (term) router.push(`/shop?q=${encodeURIComponent(term)}`)
    setOpen(false)
    setQ('')
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="grid size-9 place-items-center rounded-md text-foreground/70 transition-colors hover:text-foreground"
      >
        <Search className="size-5" />
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1">
      {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onBlur={() => !q && setOpen(false)}
        placeholder="Search gear…"
        aria-label="Search products"
        className="h-9 w-40 rounded-md border bg-card px-3 text-sm sm:w-56"
      />
      <button
        type="button"
        aria-label="Close search"
        onClick={() => {
          setOpen(false)
          setQ('')
        }}
        className="grid size-9 place-items-center rounded-md text-foreground/70 hover:text-foreground"
      >
        <X className="size-5" />
      </button>
    </form>
  )
}
