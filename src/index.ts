const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const chalk = require('chalk')
const { createHandler } = require('graphql-http/lib/use/express')
const { ruruHTML } = require('ruru/server')
const { schema } = require('./schema/schema')
const { check } = require('./config/check')
const logger = require('./utilities/logger')
import type { Application, Request, Response } from 'express'
import { NodeEnv } from './typing/enums'

require('dotenv-flow').config()

const { production, development } = NodeEnv

const PORT = process.env.PORT || '3000'
const NODE_ENV = process.env.NODE_ENV || development

const app: Application = express()

app.use(cors())

if (NODE_ENV === production) {
  app.use(helmet())
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  )
}

app.all(
  '/graphql',
  createHandler({
    schema,
  })
)

if (NODE_ENV === development) {
  app.get(check, (req: Request, res: Response) => {
    res.status(200).send('okay...')
  })

  // ruru GraphiQL runs on the endpoint '/' not '/graphql'
  app.get('/', (req: Request, res: Response) => {
    res.type('html')
    res.end(ruruHTML({
      endpoint: '/graphql',
    }))
  })
}

app.listen(PORT, () => logger.logEnv({
  msg: `running on ${chalk.blue.bold(PORT)}`,
}))
