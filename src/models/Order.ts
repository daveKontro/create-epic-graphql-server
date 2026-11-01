import { z } from 'zod'
import {
  OrderName,
  OrderStatus,
} from '../types'

export const orderSchema = z.object({
  id: z.string().optional(),  // optional? let db add id on save
  name: z.enum(OrderName),
  notes: z.string().optional(),
  status: z.enum(OrderStatus),
  customerId: z.string(),
})

export type Order = z.infer<typeof orderSchema>
