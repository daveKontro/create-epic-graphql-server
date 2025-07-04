const { expect } = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const express = require('express')
const { createHandler } = require('graphql-http/lib/use/express')
const { schema } = require('../server/src/schema/schema')
const db = require('../server/src/config/db')
import type { SinonStub } from 'sinon' 

const app = express()
app.use('/graphql', createHandler({ schema }))

describe('GraphQL Schema', () => {
  let saveStub: SinonStub
  let findStub: SinonStub

  beforeEach(() => {
    // Stub db methods
    saveStub = sinon.stub(db.customers, 'save').resolves({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })

    findStub = sinon.stub(db.customers, 'find').resolves([
      {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '123-456',
      },
    ])
  })

  afterEach(() => {
    sinon.restore()
  })

  it('returns customers', async () => {
    const query = {
      query: `
        query {
          customers {
            id
            name
            email
            phone
          }
        }
      `,
    }

    const res = await request(app)
      .post('/graphql')
      .send(query)
      .set('Accept', 'application/json')

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.have.nested.property('data.customers').that.is.an('array')
    expect(res.body.data.customers[0]).to.include({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })
  })

  it('adds a customer', async () => {
    const mutation = {
      query: `
        mutation {
          addCustomer(name: "Alice", email: "alice@example.com", phone: "123-456") {
            id
            name
            email
            phone
          }
        }
      `,
    }

    const res = await request(app)
      .post('/graphql')
      .send(mutation)
      .set('Accept', 'application/json')

    expect(res.statusCode).to.equal(200)
    expect(res.body).to.have.nested.property('data.addCustomer').that.includes({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })

    expect(saveStub.calledOnce).to.be.true
    expect(saveStub.firstCall.args[0].doc).to.include({
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })
  })
})
