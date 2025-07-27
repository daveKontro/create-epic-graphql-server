const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql')
const db = require('../config/db')
import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'
import { Product, Status } from '../typing/enums'

// https://graphql.org/graphql-js/constructing-types/

const customerType = new GraphQLObjectType({
  name: 'Customer',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
})

const orderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    notes: { type: GraphQLString },
    status: { type: GraphQLString },
    // NOTE creates relationship with other type
    customer: {
      type: customerType,
      resolve(parent: Order, args: Customer) {
        return db.customers.findById(parent.customerId)
      },
    },
  }),
})

const orderFilterInput = new GraphQLInputObjectType({
  name: 'OrderFilterInput',
  fields: {
    name: { type: GraphQLString },
    status: { type: GraphQLString },
    customerId: { type: GraphQLID },
  },
})

const customerFilterInput = new GraphQLInputObjectType({
  name: 'CustomerFilterInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    orders: {
      type: new GraphQLList(orderType),
      args: {
        filter: { type: orderFilterInput },
      },
      resolve(parent: unknown, { filter }: { filter: Order }) {
        return db.orders.find({ filter })
      },
      // NOTE:
      // GraphQL efficiently resolves only the fields 
      // requested by the client, but whether it fetches 
      // only those fields from the data source depends 
      // entirely on how resolvers are implemented...
      // the example resolver implementation shown below 
      // may avoid over fetching from a database or API
      //
      // resolve(parent, { filter }, context, info) {
      //   const fields = info
      //     .fieldNodes[0]
      //     .selectionSet
      //     .selections
      //     .map(s => s.name.value)
      //
      //   return db.orders.find(filter, fields)
      // },
    },
    order: {
      type: orderType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent: unknown, { id }: Order) => {
        return db.orders.findById(id)
      },
    },
    customers: {
      type: new GraphQLList(customerType),
      args: {
        filter: { type: customerFilterInput },
      },
      resolve(parent: unknown, { filter }: { filter: Customer }) {
        return db.customers.find({ filter })
      },
    },
    customer: {
      type: customerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent: unknown, { id }: Customer) => {
        return db.customers.findById(id)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add a customer
    addCustomer: {
      type: customerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent: unknown, args: Customer) {
        return db.customers.save(args)
      },
    },
    // Delete a customer
    deleteCustomer: {
      type: customerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent: unknown, args: Customer) {
        const orders = await db.orders.find({
          filter: { customerId: args.id },
        })

        orders.forEach(({ id }: Customer) => {
          db.orders.findByIdAndRemove(id)
        })

        return db.customers.findByIdAndRemove(args.id)
      },
    },
    // Add an order
    addOrder: {
      type: orderType,
      args: {
        name: {
          type: new GraphQLNonNull(new GraphQLEnumType({
            name: 'OrderName',
            values: {
              productOne: { value: Product.productOne },
              productTwo: { value: Product.productTwo },
              productThree: { value: Product.productThree },
            },
          })),
          defaultValue: null,
        },
        notes: { type: GraphQLString },
        status: {
          type: new GraphQLNonNull(new GraphQLEnumType({
            name: 'OrderStatus',
            values: {
              notStarted: { value: Status.notStarted },
              processing: { value: Status.processing },
              sent: { value: Status.sent },
            },
          })),
          defaultValue: Status.notStarted,
        },
        customerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent: unknown, args: Order) {
        return db.orders.save(args)
      },
    },
    // Update an order
    updateOrder: {
      type: orderType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        notes: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'OrderStatusUpdate',
            values: {
              notStarted: { value: Status.notStarted },
              processing: { value: Status.processing },
              sent: { value: Status.sent },
            },
          }),
        },
      },
      resolve(parent: unknown, { id, ...update }: Order) {
        return db.orders.findByIdAndUpdate(id, { update })
      },
    },
    // Delete an order
    deleteOrder: {
      type: orderType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent: unknown, { id }: Order) {
        return db.orders.findByIdAndRemove(id)
      },
    },
  },
})

export const schema = new GraphQLSchema({
  query: queryType,
  description: 'my schema',
  mutation,
})
