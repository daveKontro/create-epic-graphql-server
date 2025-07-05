const { expect } = require('chai')
import { orderSchema } from '../src/models/Order'
import { Product, Status } from '../src/typing/enums'

describe('orderSchema', () => {
  it('validates a correct order object', () => {
    const input = {
      name: Product.productOne,
      status: Status.processing,
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
      name: Product.productTwo,
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.false
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
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
      const errors = result.error.flatten().fieldErrors
      expect(errors.name?.[0]).to.include('Invalid enum value')
      expect(errors.status?.[0]).to.include('Invalid enum value')
    }
  })

  it('accepts when optional fields are omitted', () => {
    const input = {
      name: Product.productThree,
      status: Status.sent,
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
      name: Product.productTwo,
      status: Status.notStarted,
      customerId: 'cust001',
    }

    const result = orderSchema.safeParse(input)
    expect(result.success).to.be.true
    if (result.success) {
      expect(result.data.id).to.equal('order-001')
    }
  })
})
