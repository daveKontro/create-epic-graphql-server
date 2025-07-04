import { z } from 'zod'
import { Product, Status } from '../typing/enums'

export const orderSchema = z.object({
  id: z.string().optional(),  // optional? let db add id on save
  name: z.nativeEnum(Product),
  notes: z.string().optional(),
  status: z.nativeEnum(Status),
  customerId: z.string(),
})

export type Order = z.infer<typeof orderSchema>
