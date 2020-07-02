import { createGraphQLHandler } from "@lib/handler";
import { graphQLSchema } from "@tests/gql/schema";
import { request } from "graphql-request";
import { Server } from "miragejs";

export function query(queryDocument, { url = "/graphql", variables } = {}) {
  const {
    loc: {
      source: { body },
    },
  } = queryDocument;

  return request(url, body, variables);
}

export const mutate = query;

export function startServer() {
  const server = new Server({
    routes() {
      const testGraphQLHandler = createGraphQLHandler({
        graphQLSchema,
        mirageSchema: this.schema,
      });
      const scalarTestGraphQLHandler = createGraphQLHandler({
        context: { foo: "foo" },
        graphQLSchema,
        mirageSchema: this.schema,
        resolvers: {
          Query: {
            testContext: (_obj, _args, context) => context.foo,
            testScalarOptionalResolve: () => "foo",
          },
        },
        root: {
          testScalar: "foo",
          testScalarNonNull: "foo",
        },
      });

      this.post("/graphql-scalars", scalarTestGraphQLHandler);
      this.post("/graphql", testGraphQLHandler);
    },
  });

  server.logging = false;

  return server;
}
