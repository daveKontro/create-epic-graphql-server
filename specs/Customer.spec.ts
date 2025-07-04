import { expect } from 'chai'
import { customerSchema } from '../server/src/models/Customer'

describe('customerSchema', () => {
  it('accepts a valid customer object', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234'
    }

    const parsed = customerSchema.parse(data)
    expect(parsed).to.deep.equal(data)
  })

  it('allows an optional id', () => {
    const data = {
      id: 'cust-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-5678'
    }

    const parsed = customerSchema.parse(data)
    expect(parsed).to.deep.equal(data)
  })

  it('fails if email is invalid', () => {
    const data = {
      name: 'Invalid Email',
      email: 'not-an-email',
      phone: '555-0000'
    }

    expect(() => customerSchema.parse(data)).to.throw()
  })

  it('fails if required fields are missing', () => {
    expect(() => customerSchema.parse({})).to.throw()
  })
})
