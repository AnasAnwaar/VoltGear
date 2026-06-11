'use client'

import { createOrder } from '@/app/(app)/checkout/actions'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkoutSchema, type CheckoutValues } from '@/lib/checkout-schema'
import { formatPrice } from '@/lib/money'
import { useCart } from '@/providers/Cart'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCard, Lock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, type FieldError } from 'react-hook-form'
import { toast } from 'sonner'

const Field = ({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: FieldError
  children: React.ReactNode
  className?: string
}) => (
  <div className={className}>
    <Label className="mb-1.5 block text-sm">{label}</Label>
    {children}
    {error && <p className="mt-1 text-sm text-error">{error.message}</p>}
  </div>
)

export const CheckoutClient = ({
  freeShippingThreshold,
  flatShippingRate,
}: {
  freeShippingThreshold: number
  flatShippingRate: number
}) => {
  const { items, subtotal, clear, isReady } = useCart()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) })

  // Redirect to the cart if it empties out (and isn't mid-submit).
  useEffect(() => {
    if (isReady && items.length === 0 && !submitting) {
      router.replace('/cart')
    }
  }, [isReady, items.length, submitting, router])

  if (!isReady || items.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground">Loading your checkout…</div>
    )
  }

  const shipping = subtotal >= freeShippingThreshold ? 0 : flatShippingRate
  const total = subtotal + shipping

  const onSubmit = async (values: CheckoutValues) => {
    setSubmitting(true)
    const res = await createOrder({
      customer: values,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    })
    if (res.ok) {
      clear()
      router.push(`/checkout/confirmation/${res.orderNumber}`)
    } else {
      toast.error(res.error)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="flex flex-col gap-10">
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name} className="sm:col-span-2">
              <Input {...register('name')} autoComplete="name" />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input type="email" {...register('email')} autoComplete="email" />
            </Field>
            <Field label="Phone (optional)" error={errors.phone}>
              <Input {...register('phone')} autoComplete="tel" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address" error={errors.line1} className="sm:col-span-2">
              <Input {...register('line1')} autoComplete="address-line1" />
            </Field>
            <Field label="Apartment, suite, etc. (optional)" error={errors.line2} className="sm:col-span-2">
              <Input {...register('line2')} autoComplete="address-line2" />
            </Field>
            <Field label="City" error={errors.city}>
              <Input {...register('city')} autoComplete="address-level2" />
            </Field>
            <Field label="State / Province (optional)" error={errors.state}>
              <Input {...register('state')} autoComplete="address-level1" />
            </Field>
            <Field label="Postal / ZIP code" error={errors.postalCode}>
              <Input {...register('postalCode')} autoComplete="postal-code" />
            </Field>
            <Field label="Country" error={errors.country}>
              <Input {...register('country')} autoComplete="country-name" defaultValue="United States" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Shipping method</h2>
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="font-medium">Standard shipping</p>
              <p className="text-sm text-muted-foreground">3–5 business days</p>
            </div>
            <span className={shipping === 0 ? 'font-medium text-volt' : 'font-mono'}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Payment</h2>
          <div className="rounded-lg border border-dashed bg-card p-4">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-warning/15 px-2.5 py-1 text-sm font-medium text-warning">
              <CreditCard className="size-4" /> Demo — no real payment is processed
            </p>
            <div className="grid gap-3 opacity-60">
              <Input disabled placeholder="Card number · 4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <Input disabled placeholder="MM / YY" />
                <Input disabled placeholder="CVC" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <ul className="flex max-h-64 flex-col gap-4 overflow-y-auto">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-background">
                  {item.image && (
                    <Image src={item.image} alt={item.title} fill sizes="56px" className="object-contain p-1.5" />
                  )}
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-volt text-[10px] font-bold text-volt-foreground">
                    {item.quantity}
                  </span>
                </div>
                <p className="line-clamp-2 flex-1 text-sm">{item.title}</p>
                <Price className="text-sm" amount={item.price * item.quantity} />
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>
                <Price amount={subtotal} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="mt-1 flex items-center justify-between border-t pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd>
                <Price className="text-lg font-semibold" amount={total} />
              </dd>
            </div>
          </dl>
          <Button type="submit" variant="volt" size="xl" disabled={submitting}>
            {submitting ? 'Placing order…' : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" /> Secure demo checkout
          </p>
        </div>
      </aside>
    </form>
  )
}
