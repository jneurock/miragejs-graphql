import { Response } from "miragejs";
import createFieldResolver from "./resolvers/field";
import { ensureExecutableGraphQLSchema } from "./utils";
import { ensureModels } from "./orm/models";
import { graphql } from "graphql";

/**
 * TODO:
 *   - Document this
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
  const contextValue = { ...context, mirageSchema };
  const fieldResolver = createFieldResolver(resolvers);
  const schema = ensureExecutableGraphQLSchema(graphQLSchema);

  ensureModels({ graphQLSchema, mirageSchema });

  return function graphQLHandler(_mirageSchema, request) {
    try {
      const { query, variables } = JSON.parse(request.requestBody);

      return graphql({
        contextValue,
        fieldResolver,
        rootValue: root,
        schema,
        source: query,
        variableValues: variables,
      });
    } catch (ex) {
      return new Response(500, {}, { errors: [ex] });
    }
  };
}
