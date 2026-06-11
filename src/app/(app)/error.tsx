'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt">Something shorted out</p>
      <h1 className="text-3xl font-semibold tracking-tight">An unexpected error occurred</h1>
      <p className="max-w-md text-muted-foreground">
        We hit a snag rendering this page. Try again — if it keeps happening, head back home.
      </p>
      <div className="flex gap-3">
        <Button variant="volt" size="xl" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" size="xl">
          <a href="/">Go home</a>
        </Button>
      </div>
    </div>
  )
}
