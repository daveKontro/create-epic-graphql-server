import type { Request } from 'express'
import type { User } from 'typing/interfaces'

// NOTE this is a DUMMY pattern to demo how 
// one might pass request info into GraphQL 
// via a callback like "getUserFromReq"

const setDummySession = ({
  req,
}:{
  req: Request,
}) => {
  // in a production app user info might 
  // be set upstream via a security model

  const { session } = req

  return {
    ...session,
    user: {
      id: 'user123',
      roles: ['readWrite'],
    },
  }
}

export const getUserFromReq = ({
  req,
}:{
  req: Request,
}): User => {
  const session = setDummySession({ req })

  return {
    id: session.user.id,
    roles: session.user.roles,
  }
}
