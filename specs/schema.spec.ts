const { expect } = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const express = require('express')
const { createHandler } = require('graphql-http/lib/use/express')
const { schema } = require('../src/schema/schema')
import type { SinonStub } from 'sinon'

describe('GraphQL Schema', () => {
  let saveStub: SinonStub
  let findStub: SinonStub
  let app

  beforeEach(() => {
    // create fresh stubs for each test
    saveStub = sinon.stub().resolves({
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })

    findStub = sinon.stub().resolves([
      {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '123-456',
      },
    ])

    // build express app, inject stubbed db into context
    app = express()
    app.use(
      '/graphql',
      createHandler({
        schema,
        context: () => ({
          db: {
            customers: {
              save: saveStub,
              find: findStub,
            },
          },
        }),
      })
    )
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

    expect(findStub.calledOnce).to.be.true
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
    expect(saveStub.firstCall.args[0]).to.include({
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123-456',
    })
  })
})
