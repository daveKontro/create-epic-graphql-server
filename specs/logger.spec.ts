
const { expect } = require('chai')
const sinon = require('sinon')
const logger = require('../src/utilities/logger')
import type { SinonStub, SinonFakeTimers } from 'sinon'

describe('CustomLogger', () => {
  let infoStub: SinonStub
  let errorStub: SinonStub
  let warnStub: SinonStub
  let clock: SinonFakeTimers

  beforeEach(() => {
    if (!logger.log) {
      throw new Error('logger.log must be initialized before tests')
    }

    infoStub = sinon.stub(logger.log, 'info')
    errorStub = sinon.stub(logger.log, 'error')
    warnStub = sinon.stub(logger.log, 'warn')
    clock = sinon.useFakeTimers(new Date('2025-06-29T12:00:00Z').getTime())
  })

  afterEach(() => {
    infoStub.restore()
    errorStub.restore()
    warnStub.restore()
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

  it('logs an error with a header and Error instance', () => {
    logger.logErr({
      header: 'TestHeader',
      err: new Error('Something went wrong'),
    })
  
    expect(errorStub.calledOnce).to.be.true
    const [message] = errorStub.firstCall.args
    expect(message).to.equal('TestHeader: Something went wrong')
  })
  
  it('logs a warning with custom level', () => {
    logger.logErr({
      header: 'WarnHeader',
      err: new Error('This is a warning'),
      level: 'warn',
      meta: { cause: 'testing' },
    })
  
    expect(warnStub.calledOnce).to.be.true
    const [message, meta] = warnStub.firstCall.args
    expect(message).to.equal('WarnHeader: This is a warning')
    expect(meta).to.deep.equal({ cause: 'testing' })
  })
  
  it('logs unexpected error types gracefully', () => {
    logger.logErr({
      header: 'Oops',
      err: 'some string error',
    })
  
    expect(errorStub.calledOnce).to.be.true
    const [message] = errorStub.firstCall.args
    expect(message).to.equal('unexpected Oops: some string error')
  })
})
