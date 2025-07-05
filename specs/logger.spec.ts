
const { expect } = require('chai')
const sinon = require('sinon')
const logger = require('../src/utilities/logger')
import type { SinonStub, SinonFakeTimers } from 'sinon'

describe('CustomLogger', () => {
  let infoStub: SinonStub
  let clock: SinonFakeTimers

  beforeEach(() => {
    if (!logger.log) {
      throw new Error('logger.log must be initialized before tests')
    }

    infoStub = sinon.stub(logger.log, 'info')
    clock = sinon.useFakeTimers(new Date('2025-06-29T12:00:00Z').getTime())
  })

  afterEach(() => {
    infoStub.restore()
    clock.restore()
  })

  it('logs a timestamp with default message', () => {
    logger.logTimeStamp()

    expect(infoStub.calledOnce).to.be.true
    const logged = infoStub.firstCall.args[0]
    expect(logged).to.match(/\[\d{1,2}\/\d{1,2}\/\d{2}, 12:00:00/)
  })

  it('logs a timestamp with a custom message', () => {
    logger.logTimeStamp({ msg: 'Started at' })

    expect(infoStub.calledOnce).to.be.true
    const logged = infoStub.firstCall.args[0]
    expect(logged).to.include('Started at')
    expect(logged).to.match(/\[\d{1,2}\/\d{1,2}\/\d{2}, 12:00:00/)
  })

  it('logs environment with custom message', () => {
    logger.logEnv({ msg: 'Server started' })

    expect(infoStub.calledOnce).to.be.true
    const logged = infoStub.firstCall.args[0]
    expect(logged).to.include('Server started')
    expect(logged).to.include('[development]')
  })
})
