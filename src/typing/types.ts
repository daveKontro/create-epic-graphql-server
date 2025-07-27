import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'

export type Id = string

export type Err = Error | unknown

export type Msg = string

export type Doc = Customer | Order
