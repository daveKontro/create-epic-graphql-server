const path = require('path')
const z = require('zod')
const { log, logErr } = require('../utilities/logger')
const { customerSchema } = require('../models/Customer')
const { orderSchema } = require('../models/Order')
import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'
import { DataSet } from '../typing/enums'
import type { Id, Err } from '../typing/types'
import type * as I from '../typing/interfaces'

require('dotenv-flow').config()

const crud = {
  url: `http://localhost:${process.env.JSON_SERVER_PORT || 3210}`,
  headers: {
    'Content-Type': 'application/json',
  },
  datasets: { ...DataSet },
  errors: {
    throw({ response }: { response: Response }) {
      throw new Error(`fetch failed with status ${response.status}`)
    },
    handle({ err }: { err: Err }) {
      logErr({ header: 'fetch error', err })
    },
  },
  async create({ dataSet, doc }: I.Create) {
    const resource = path.join(this.url, dataSet)
    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(doc),
    }

    let result

    try {
      const response: Response = await fetch(resource, options)

      if (!response.ok) this.errors.throw({ response })

      result = await response.json()
    } catch (err: unknown) {
      this.errors.handle({ err })
    }

    return result
  },
  async read({ dataSet, filter }: I.Read) {
    let resource = path.join(this.url, dataSet)

    // add "filter" as query params
    if (filter && Object.keys(filter).length) {
      const searchParams = new URLSearchParams(
        Object.entries(filter)
      )

      resource += '?' + searchParams.toString()
    }

    let result: Customer[] | Order[]

    try {
      const response: Response = await fetch(resource)

      if (!response.ok) this.errors.throw({ response })

      result = await response.json()

      return result
    } catch (err: unknown) {
      this.errors.handle({ err })
    }
  },
  async readOne({ dataSet, id }: I.ReadOne) {
    const resource = path.join(this.url, dataSet, id)

    let result: Customer | Order

    try {
      const response: Response = await fetch(resource)

      if (!response.ok) this.errors.throw({ response })

      result = await response.json()

      return result
    } catch (err: unknown) {
      this.errors.handle({ err })
    }
  },
  async update({ dataSet, id, update }: I.Update) {
    const resource = path.join(this.url, dataSet, id)
    const options = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(update),
    }

    let result

    try {
      const response: Response = await fetch(resource, options)

      if (!response.ok) this.errors.throw({ response })

      result = await response.json()
    } catch (err: unknown) {
      this.errors.handle({ err })
    }

    return result
  },
  async delete({ dataSet, id }: I.Delete) {
    const resource = path.join(this.url, dataSet, id)
    const options = {
      method: 'DELETE',
      headers: this.headers,
    }

    let result

    try {
      const response: Response = await fetch(resource, options)

      if (!response.ok) this.errors.throw({ response })

      result = await response.json()
    } catch (err: unknown) {
      this.errors.handle({ err })
    }

    return result
  },
}

export = {
  [crud.datasets.customers]: {
    async save(doc: Customer) {
      let customer: Customer | undefined

      try {
        customer = customerSchema.parse({
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
        })
      } catch (err: typeof z.ZodError | unknown) {
        if(err instanceof z.ZodError) {
          err.issues.forEach((err: typeof z.ZodError, index: number) => {
            log.error(`${err.path[index]} ${err.message}`, { index })
          })
        } else {
          logErr({ header: 'customer parse error', err })
        }
      }

      if (customer) {
        const result = await crud.create({
          dataSet: crud.datasets.customers,
          doc: customer,
        })

        return result
      }
    },
    async find({ filter }: I.FilterOptions) {
      const result = await crud.read({
        dataSet: crud.datasets.customers,
        filter,
      })

      return result
    },
    async findById(id: Id) {
      const result = await crud.readOne({
        dataSet: crud.datasets.customers,
        id,
      })

      return result
    },
    async findByIdAndUpdate(id: Id, { update }: I.UpdateOptions) {
      const result = await crud.update({
        dataSet: crud.datasets.customers,
        id,
        update,
      })

      return result
    },
    async findByIdAndRemove(id: Id) {
      const result = await crud.delete({
        dataSet: crud.datasets.customers,
        id,
      })

      return result
    },
  },
  [crud.datasets.orders]: {
    async save(doc: Order) {
      let order: Order | undefined

      try {
        order = orderSchema.parse({
          name: doc.name,
          ...(doc.notes && { notes: doc.notes }),
          status: doc.status,
          customerId: doc.customerId,
        })
      } catch (err: typeof z.ZodError | unknown) {
        if (err instanceof z.ZodError) {
          err.issues.forEach((err: typeof z.ZodError, index: number) => {
            log.error(`${err.path[index]} ${err.message}`, { index })
          })
        } else {
          logErr({ header: 'order parse error', err })
        }
      }

      if (order) {
        const result = await crud.create({
          dataSet: crud.datasets.orders,
          doc: order,
        })

        return result
      }
    },
    async find({ filter }: I.FilterOptions) {
      const result = await crud.read({
        dataSet: crud.datasets.orders,
        filter,
      })

      return result
    },
    async findById(id: Id) {
      console.log(id)
      const result = await crud.readOne({
        dataSet: crud.datasets.orders,
        id,
      })

      return result
    },
    async findByIdAndUpdate(id: Id, { update }: I.UpdateOptions) {
      const result = await crud.update({
        dataSet: crud.datasets.orders,
        id,
        update,
      })

      return result
    },
    async findByIdAndRemove(id: Id) {
      const result = await crud.delete({
        dataSet: crud.datasets.orders,
        id,
      })

      return result
    },
  },
}
