import { getCache, putCache } from "./cache";
import { isRelayType } from "./relay/pagination";
import {
  GraphQLSchema,
  buildASTSchema,
  isListType,
  isNonNullType,
  isObjectType,
  parse,
} from "graphql";

function getBuiltInGraphQLSchemaObjectTypes(graphQLSchema) {
  const cacheKeys = {
    key: "builtInGraphQLSchemaObjectTypes",
    schema: graphQLSchema,
  };

  return (
    getCache(cacheKeys) ||
    putCache({
      ...cacheKeys,
      value: [
        graphQLSchema.getMutationType(),
        graphQLSchema.getQueryType(),
        graphQLSchema.getSubscriptionType(),
      ],
    })
  ).value;
}

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

// Test: it returns true if object type not root query, mutation or subscription
// Test: it returns false if root query, mutation or subscription type
/**
 * TODO: Document this
 *
 * @param {GraphQLSchema} graphQLSchema
 * @param {Object} type
 * @returns {Boolean}
 */
export function isNotBuiltInGraphQLSchemaObjectType(graphQLSchema, type) {
  return (
    isObjectType(type) &&
    !getBuiltInGraphQLSchemaObjectTypes(graphQLSchema).find(
      (builtInObjectType) => type === builtInObjectType
    )
  );
}

/**
 * TODO: Document this
 *
 * @param {*} obj
 * @param {*} typename
 */
export function setTypename(obj, typename) {
  obj.__typename = typename;

  return obj;
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

// Test: it unwraps non-null types
// Test: it unwraps list types
// Test: it can unwrap a non-null list of non-null types
// Test: it can handle any other types
/**
 * TODO: Document this
 *
 * @param {Object} type
 * @param {Object} meta
 * @returns {Object}
 */
export function unwrapType(type, meta = { isList: false }) {
  const isList = isListType(type);

  if (isList || isNonNullType(type)) {
    if (!meta.isList) {
      meta.isList = isList;
    }

    return unwrapType(type.ofType, meta);
  }

  return { ...meta, type };
}

/**
 * TODO: Document this
 *
 * @param {Object} type
 * @param {Object} meta
 * @returns {Object}
 */
export function unwrapTypeForModel(type, meta = { isList: false }) {
  if (type.name && isRelayType(type)) {
    const fields = type.getFields();

    return fields.edges
      ? unwrapTypeForModel(fields.edges.type, meta)
      : unwrapTypeForModel(fields.node.type, meta);
  }

  const isList = isListType(type);

  if (isList || isNonNullType(type)) {
    if (!meta.isList) {
      meta.isList = isList;
    }

    return unwrapTypeForModel(type.ofType, meta);
  }

  return { ...meta, type };
}
