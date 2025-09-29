![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FdaveKontro%2Fcreate-epic-graphql-server%2Fmain%2Fpackage.json&query=%24.version&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABnUlEQVR4nO2bT0vEMBDFE+lBjCgoHvMx9Puf/Rq5eRGUIEIhngpS2HRet+nLn/ldM8m+fTuZLs3EGpzXFMP7jnmnYJ23UDz6ASmGhM45E9SAG3D9OzD+dNAfCDIgxRAxOfWDZkB3IAY8F1NxPE/SQHHBqL34rZEWQ90CwriXoioKIM1YkQEpho/r5NSLbgG2ADablbK16r9m62kwfAZMbAHzPBtjjJkmuZRlzgIydw3dgD3ir/nCa7rfAls1rHsDtlADcoOtPwIlaAawBbBRAzJj96epKEyull00IMXwXUZOXegWYAtgowawBbBRA9gC2KgBbAFs1AC2ADZqAFsAGzWALYCNGsAWwCZ7cNjLW+HcAenwGaAGsAWwUQPYAthkDbDOP5wlpBTW+dvc+FYG9HA28JsbpHSIrFtcFtDOj//r7O0aoRhwVIvLEesMXwRFHdWt/iWWdIwPnwFqgCTIOi++gdEa0gz4LKqiAHpjRMjwBkC3LFt5HCK3R4fPAMgA6/xjKSFHYZ2HrveiGfAFxjP4QYLhLWCdf0Pn1Mwf/j9N4kR1HlsAAAAASUVORK5CYII=&label=version&labelColor=%23ff883e&color=%23fff5e3)
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FdaveKontro%2Fcreate-epic-graphql-server%2Fmain%2Fpackage.json&query=%24.engines.node&logo=nodedotjs&label=node&labelColor=%23ff883e&color=%23fff5e3)
![Static Badge](https://img.shields.io/badge/npm->=v10-%23fff5e3?logo=npm&labelColor=%23ff883e)

# Create Epic GraphQL Server
This module provides a configured [GraphQL](https://www.npmjs.com/package/graphql) server.  

Having a preconfigured server will jump-start your project so you never have to begin from scratch.  

Use GraphQL to unify your data into a single API. Take advantage of the powerful, intuitive GraphQL query language.  

Interact with this project template live [here](https://www.createepicgraphqlserver.com/).  

## installation
first install globally  
```
npm install -g create-epic-graphql-server
```

then create your project  
```
npx create-epic-graphql-server --name={my-project}
```

## usage
spin up the mock database (described below) `npm run dev:db`  

now spin up the development server `npm run dev`  

congrats, your API is now live!  

### Graph*i*QL
use the Graph*i*QL IDE to interact with your development server's API  

this project provides the [ruru](https://www.npmjs.com/package/ruru) Graph*i*QL interface on `http://localhost:3000` (by default) during development  

sample queries are provided later in this document  

### mock database
in order to get up and running quickly without the need to initially plug into a real database, this project provides a mock database via [json-server](https://www.npmjs.com/package/json-server)  

the database starts when you run `npm run dev:db`, which automatically creates and runs of the file `db.json5`; the db file is seeded upon each startup from `db-seed.json`  

see file `/src/config/db.ts` to understand how the database works; you will likely, eventually remove this file when you plug into a real database and replace the contents of `/src/models` with actual database models... that said, the provided pattern gives you scaffolding to build around  

⚠️ please note this mock database is not intended or suited for production use ⚠️  

## schema and types
the schema sits at the heart of the GraphQL service  

the types describe what data you can query, and the schema is the collection of what the service provides  

a sample schema has been configured in `/src/schema/schema` with model validation, read all, read on, mutations, etc... again, your usecase will necessitate alterations to the schema, but the provided pattern might help you along the way  

## test suite
the test suite is enabled to run unit and integration tests  

to create a test add a file tp `specs/` and follow this file naming format: `*.spec.ts`  

tests run automatically during development via `npm run dev` or the test suite stand alone like so  

```
npm run test
npm run test:watch
```

## linting
linting rules are in `.eslintrc.js`; install the [ESLint](https://www.npmjs.com/package/eslint) pluggin if using vscode  

```
npm run lint
```

## custom logger
A customized [winston](https://www.npmjs.com/package/winston) logger instance resides in `utilities/logger`, with usage found thoughout the codebase methods are provide to log a timestamp or the current node environment  

## pre-commit
scripts in `.husky/pre-commit` are run on commits for quality control  

add or remove scripts you'd like run before code is commited  

## environmental settings
you can create a `.env` file at the project root and add the following variables  

also add any additional variables your project needs  

### develop (dev server)
```
# optional but recommended
NODE_ENV=development
PORT={port number}
SESSION_SECRET=mySecret!
# optional
JSON_SERVER_PORT={dev db port, default 3210}
```

### production (build)
```
# optional but recommended
NODE_ENV=production
PORT={port number}
```

## query samples
run these queries against the development server to get a feel the GraphQL query language  

### get all orders
```
  {
    orders {
      __typename
      id
      name
      notes
      status
      customer {
        __typename
        name
      }
    }
  }
```

### get all customers
```
  {
    customers {
      id
      name
      email
      phone
    }
  }
```

### get an order by id
```
  {
    order(id: "2") {
      id
      name
      status
      customer {
        name
      }
    }
  }
```

### get orders by status
```
  {
    orders(filter: { status: "Not Started" }) {
      id
      name
      status
    }
  }
```

### create a customer
```
  mutation {
    addCustomer(
      name: "Tom Hill",
      email: "tom@example.com",
      phone: "555-5555"
    ) {
      id
      name
      email
      phone
    }
  }
```

### create an order
- use id from new customer "Tom Hill"

```
  mutation {
    addOrder(
      name: productOne,
      status: notStarted,
      customerId: "{id}"
    ) {
      id
      name
      status
      customer {
        id
        name
      }
    }
  }
```

### update and order
- use id from new order created above

```
  mutation {
    updateOrder(
      id: "{id}",
      status: processing,
    ) {
      id
      name
      status
      customer {
        id
        name
      }
    }
  }
```

### delete a customer by id
- use id from new customer "Tom Hill"
- resolver is setup to delete associated orders too

```
  mutation {
    deleteCustomer(id: "{id}") {
      id
      name
    }
  }
```