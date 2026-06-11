'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'

export const Newsletter = () => {
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!email) return
        toast.success("You're subscribed — watch your inbox for drops.")
        setEmail('')
      }}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="h-11 border-white/15 bg-white/5 text-white placeholder:text-neutral-500"
      />
      <Button type="submit" variant="volt" size="lg" className="h-11 shrink-0">
        Subscribe
      </Button>
    </form>
  )
}
