import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.email('Enter a valid email address'),
  phone: z.string().optional(),
  line1: z.string().min(3, 'Enter your street address'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().optional(),
  postalCode: z.string().min(2, 'Enter your postal/ZIP code'),
  country: z.string().min(2, 'Enter your country'),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>

export const checkoutItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

export type CheckoutItem = z.infer<typeof checkoutItemSchema>
