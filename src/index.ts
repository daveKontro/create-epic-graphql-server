const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const { createHandler } = require('graphql-http/lib/use/express')
const { ruruHTML } = require('ruru/server')
const { schema } = require('./schema/schema')
const { check } = require('./config/check')
const logger = require('./utilities/logger')
import type { Application, Request, Response } from 'express'
import { NodeEnv } from './typing/enums'

require('dotenv-flow').config()

const { development } = NodeEnv

const PORT = process.env.PORT || '3000'
const NODE_ENV = process.env.NODE_ENV || development

const app: Application = express()

app.use(cors())

// https://graphql.org/graphql-js/running-an-express-graphql-server/
// https://graphql.org/graphql-js/constructing-types/

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

  // https://stackoverflow.com/questions/76274054/graphql-http-missing-query
  // https://graphql.org/graphql-js/running-an-express-graphql-server/

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
