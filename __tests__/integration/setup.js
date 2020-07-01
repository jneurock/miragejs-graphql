import { createGraphQLHandler } from "@lib/handler";
import { graphQLSchema } from "@tests/gql/schema";
import { GraphQLClient } from "graphql-request";
import { Server } from "miragejs";

const graphQLClient = new GraphQLClient("/graphql");

export function query(queryDocument, variables) {
  const {
    loc: {
      source: { body },
    },
  } = queryDocument;

  return graphQLClient.request(body, variables);
}

export const mutate = query;

export const server = new Server({
  routes() {
    const graphQLHandler = createGraphQLHandler({
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

    this.post("/graphql", graphQLHandler);
  },
});

server.logging = false;
