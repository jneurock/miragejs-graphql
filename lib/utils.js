import { isRelayType } from "./relay/pagination";
import {
  GraphQLSchema,
  buildASTSchema,
  isListType,
  isNonNullType,
  parse,
} from "graphql";

/**
 * TODO:
 *   - Document this
 *
 * @param {*} graphQLSchema
 */
export function ensureExecutableGraphQLSchema(graphQLSchema) {
  if (!(graphQLSchema instanceof GraphQLSchema)) {
    if (typeof graphQLSchema === "string") {
      graphQLSchema = parse(graphQLSchema);
    }

    graphQLSchema = buildASTSchema(graphQLSchema, {
      commentDescriptions: true,
    });
  }

  return graphQLSchema;
}

/**
 * TODO: Document this
 *
 * @param {*} info
 */
export function unwrapInterfaceType(info) {
  const selection = info.fieldNodes[0].selectionSet.selections.find(
    ({ kind }) => kind === "InlineFragment"
  );

  if (selection) {
    const {
      typeCondition: {
        name: { value: typeName },
      },
    } = selection;

    return info.schema.getTypeMap()[typeName];
  }
}

/**
 * TODO: Document this
 *
 * @param {Object} type
 * @param {Object} options
 * @returns {Object}
 */
export function unwrapType(
  type,
  options = { considerRelay: false, isList: false }
) {
  if (options.considerRelay && isRelayType(type)) {
    const fields = type.getFields();

    return fields.edges
      ? unwrapType(fields.edges.type, options)
      : unwrapType(fields.node.type, options);
  }

  const isList = isListType(type);

  if (isList || isNonNullType(type)) {
    if (!options.isList) {
      options.isList = isList;
    }

    return unwrapType(type.ofType, options);
  }

  return { isList: options.isList, type };
}
