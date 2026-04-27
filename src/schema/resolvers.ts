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
    // NOTE resolves the customer relationship on Order... called by 
    // GraphQL for each order when the client requests customer fields
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

// NOTE:
// GraphQL efficiently resolves only the fields
// requested by the client, but whether it fetches
// only those fields from the data source depends
// entirely on how resolvers are implemented...
// the example resolver implementation shown below
// may avoid over fetching from a database or API
//
// Query: {
//   orders: (parent, { filter }, { db }, info) => {
//     const selections = info.fieldNodes[0].selectionSet?.selections ?? []
//
//     const fields = selections.reduce((acc: Record<string, number>, selection) => {
//       if (selection.kind === 'Field') {
//         acc[selection.name.value] = 1
//       }
//
//       return acc
//     }, {})
//
//     // filter = query criteria (docs, rows, etc.)
//     // fields = projection (fields, columns, etc.)
//     return db.orders.find(filter, fields)
//   },
//  ...
// }
