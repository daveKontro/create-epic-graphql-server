import type { Resolvers } from '../types/generated'
import { OrderName, OrderStatus } from '../types'

// NOTE Resolvers has Context baked in via the generated type

export const resolvers: Resolvers = {
  OrderName: {
    productOne: OrderName.productOne,
    productTwo: OrderName.productTwo,
    productThree: OrderName.productThree,
  },
  OrderStatus: {
    notStarted: OrderStatus.notStarted,
    processing: OrderStatus.processing,
    sent: OrderStatus.sent,
  },
  OrderStatusUpdate: {
    notStarted: OrderStatus.notStarted,
    processing: OrderStatus.processing,
    sent: OrderStatus.sent,
  },
  Query: {
    orders: (parent, { filter }, { db }) => db.orders.find({ filter }),
    order: (parent, { id }, { db }) => db.orders.findById(id),
    customers: (parent, { filter }, { db }) => db.customers.find({ filter }),
    customer: (parent, { id }, { db }) => db.customers.findById(id),
  },
  Order: {
    customer: (parent, args, { db }) => db.customers.findById(parent.customerId),
  },
  Mutation: {
    addCustomer: (parent, args, { db }) => db.customers.save(args),
    deleteCustomer: async (parent, { id }, { db }) => {
      const orders = await db.orders.find({ filter: { customerId: id } })
      orders.forEach(({ id: orderId }: { id: string }) => db.orders.findByIdAndRemove(orderId))
      return db.customers.findByIdAndRemove(id)
    },
    addOrder: (parent, args, { db }) => db.orders.save(args),
    updateOrder: (parent, { id, ...update }, { db }) => db.orders.findByIdAndUpdate(id, { update }),
    deleteOrder: (parent, { id }, { db }) => db.orders.findByIdAndRemove(id),
  },
}
