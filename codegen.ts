import type { CodegenConfig } from '@graphql-codegen/cli'

// NOTE Mappers are optional...
// without them, codegen generates TypeScript types directly 
// from the SDL and uses those as resolver parent types... 
// Mappers override the parent type for a given GraphQL type, 
// telling codegen to use an existing type instead of the 
// generated one... they are used here because Zod enforces 
// strict validation on writes (name, email, phone are required) 
// while the SDL output type allows nullable fields to reflect 
// what reads may return... the two serve different purposes,
// so let Zod types flow through the resolver chain internally 
// while the SDL type defines the public API contract...

const config: CodegenConfig = {
  schema: './src/schema/schema.graphql',
  generates: {
    './src/types/generated.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../index#Context',
        mappers: {
          Customer: './index#CustomerModel',
          Order: './index#OrderModel',
        },
        useIndexSignature: true,
      },
    },
  },
}

export default config
