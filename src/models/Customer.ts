import { z } from 'zod'

export const customerSchema = z.object({
  id: z.string().optional(),  // optional? let db add id on save
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

export type Customer = z.infer<typeof customerSchema>
