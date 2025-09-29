const express = require('express')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const graphqlRouter = express.Router()
const cors = require('cors')
const helmet = require('helmet')
const chalk = require('chalk')
const { createHandler } = require('graphql-http/lib/use/express')
const { ruruHTML } = require('ruru/server')
const routes = require('./routes')
const db = require('./config/db')
const { schema } = require('./schema/schema')
const logger = require('./utilities/logger')
const { getUserFromReq } = require('./utilities/getUserFromReq')
import type { Application, Request, Response } from 'express'
import { NodeEnv } from './typing/enums'
import type { User } from './typing/interfaces'

require('dotenv-flow').config()

export interface Context {
  user: User,
  db: typeof db,
}

const { production, development } = NodeEnv

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || development
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret'

const app: Application = express()

app.use(session({
  cookie: {
    maxAge: 24*60*60*1000,  // 24 hrs
  },
  // it's recommended that compatible, robust npm modules be 
  // explored before choosing a production app's memory store:
  // https://www.npmjs.com/package/express-session#compatible-session-stores
  store: new MemoryStore({
    checkPeriod: 24*60*60*1000,
  }),
  resave: false,
  secret: SESSION_SECRET,
  saveUninitialized: false,
}))

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

app.use(routes)

graphqlRouter.all('/',
  createHandler({
    schema,
    context: (req: Request): Context => {
      const user = getUserFromReq({ req })

      return {
        user,
        db,
      }
    },
  })
)

app.use('/graphql', graphqlRouter)

if (NODE_ENV === development) {
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
