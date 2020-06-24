import { Response } from "miragejs"; // eslint-disable-line import/no-extraneous-dependencies
import { createFieldResolver, createTypeResolver } from "./resolvers";
import { ensureModels } from "./orm";
import { ensureExecutableGraphQLSchema } from "./utils";
import { graphql } from "graphql";

function setupHandler({ context, graphQLSchema, mirageSchema, resolvers }) {
  const fieldResolver = createFieldResolver(resolvers);
  const typeResolver = createTypeResolver(resolvers);

  context.mirageSchema = mirageSchema;

  ensureModels({ graphQLSchema, mirageSchema });

  return { fieldResolver, schema: graphQLSchema, typeResolver };
}

/**
 * TODO:
 *   - Document this
 *   - Can we create this once instead of during each test?
 *
 * @param {Object} options
 */
export function createGraphQLHandler({
  context = {},
  graphQLSchema,
  mirageSchema,
  resolvers,
  root,
}) {
  const { fieldResolver, schema, typeResolver } = setupHandler({
    context,
    graphQLSchema: ensureExecutableGraphQLSchema(graphQLSchema),
    mirageSchema,
    resolvers,
  });

  return function graphQLHandler(_mirageSchema, request) {
    try {
      const { query, variables } = JSON.parse(request.requestBody);

      return graphql({
        contextValue: context,
        fieldResolver,
        rootValue: root,
        schema,
        source: query,
        typeResolver,
        variableValues: variables,
      });
    } catch (ex) {
      return new Response(500, { errors: [ex] });
    }
  };
}
