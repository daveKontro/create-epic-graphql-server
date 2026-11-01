const { expect } = require('chai')
import { z } from 'zod'
import { orderSchema } from '../src/models/Order'
import {
  OrderName,
  OrderStatus,
} from '../src/types/enums'

describe('orderSchema', () => {
  it('validates a correct order object', () => {
    const input = {
      name: OrderName.productOne,
      status: OrderStatus.processing,
      customerId: 'abc123',
      notes: 'Fragile item',
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.true

    if (result.success) {
      expect(result.data).to.deep.include(input)
    }
  })

  it('fails if required fields are missing', () => {
    const input = {
      name: OrderName.productTwo,
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.false

    if (!result.success) {
      const errors = z.flattenError(result.error).fieldErrors

      expect(errors).to.have.property('status')
      expect(errors).to.have.property('customerId')
    }
  })

  it('fails if name or status is not a valid enum', () => {
    const input = {
      name: 'Invalid Product',
      status: 'Invalid Status',
      customerId: 'abc123',
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.false

    if (!result.success) {
      const paths = result.error.issues
        .map((issue) => issue.path[0])

      expect(paths).to.include.members(['name', 'status'])
    }
  })

  it('accepts when optional fields are omitted', () => {
    const input = {
      name: OrderName.productThree,
      status: OrderStatus.sent,
      customerId: 'xyz789',
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.true

    if (result.success) {
      expect(result.data.notes).to.be.undefined
      expect(result.data.id).to.be.undefined
    }
  })

  it('accepts if id is provided but optional', () => {
    const input = {
      id: 'order-001',
      name: OrderName.productTwo,
      status: OrderStatus.notStarted,
      customerId: 'cust001',
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.true

    if (result.success) {
      expect(result.data.id).to.equal('order-001')
    }
  })
})
