'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export const AnnouncementBar = ({ text }: { text: string }) => {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(window.localStorage.getItem('vg-announce-dismissed') === '1')
  }, [])

  if (dismissed) return null

  return (
    <div className="relative bg-volt text-volt-foreground">
      <div className="container flex items-center justify-center py-2 text-center text-sm font-medium">
        <p className="px-8">{text}</p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            setDismissed(true)
            window.localStorage.setItem('vg-announce-dismissed', '1')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/10"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
