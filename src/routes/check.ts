const express = require('express')
const router = express.Router()
import type { Request, Response } from 'express'
import { NodeEnv } from '../typing/enums'

require('dotenv-flow').config()

// NOTE remove this if you wish, it won't affect the graphql route,
// this is just here to test express and typescript live transpile, 
// but also demonstrates a conventional routing pattern if needed

if (process.env.NODE_ENV === NodeEnv.development) {
  router.get('/check', (req: Request, res: Response) => {
    res.status(200).send('okay...')
  })
}

export = router
