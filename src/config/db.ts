const path = require('path')
const logger = require('../utilities/logger')
import type { Customer } from '../models/Customer'
import type { Order } from '../models/Order'
import { DataSet } from '../typing/enums'
import type * as I from '../typing/interfaces'

require('dotenv-flow').config()

const { log } = logger

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
    handle({ err }:{ err: unknown }) {
      if (err instanceof Error) {
        log.error(`fetch error: ${err.message}`)
      } else {
        log.error(`unexpected fetch error: ${err}`)
      }
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
  async update({ dataSet, id, patch }: I.Update) {
    const resource = path.join(this.url, dataSet, id)
    const options = {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(patch),
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
    async save({ doc }: I.Doc) {
      const result = await crud.create({
        dataSet: crud.datasets.customers,
        doc,
      })

      return result
    },
    async find({ filter }: I.Filter) {
      const result = await crud.read({
        dataSet: crud.datasets.customers,
        filter,
      })

      return result
    },
    async findById({ id }: I.Id) {
      const result = await crud.readOne({
        dataSet: crud.datasets.customers,
        id,
      })

      return result
    },
    async findByIdAndUpdate({ id, patch }: I.Update) {
      const result = await crud.update({
        dataSet: crud.datasets.customers,
        id,
        patch,
      })

      return result
    },
    async findByIdAndRemove({ id }: I.Id) {
      const result = await crud.delete({
        dataSet: crud.datasets.customers,
        id,
      })

      return result
    },
  },
  [crud.datasets.orders]: {
    async save({ doc }: I.Doc) {
      const result = await crud.create({
        dataSet: crud.datasets.orders,
        doc,
      })

      return result
    },
    async find({ filter }: I.Filter) {
      const result = await crud.read({
        dataSet: crud.datasets.orders,
        filter,
      })

      return result
    },
    async findById({ id }: I.Id) {
      const result = await crud.readOne({
        dataSet: crud.datasets.orders,
        id,
      })

      return result
    },
    async findByIdAndUpdate({ id, patch }: I.Update) {
      const result = await crud.update({
        dataSet: crud.datasets.orders,
        id,
        patch,
      })

      return result
    },
    async findByIdAndRemove({ id }: I.Id) {
      const result = await crud.delete({
        dataSet: crud.datasets.orders,
        id,
      })

      return result
    },
  },
}
