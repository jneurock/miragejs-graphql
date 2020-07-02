import { btoa } from "b2a";

const RELAY_ARGS = ["after", "before", "first", "last"];

function getIndexOfRecord(records, cursor, typeName, encode) {
  let index = null;

  if (cursor == null) return index;

  for (let i = 0; i < records.length; i++) {
    if (encode(`${typeName}:${records[i].id}`) === cursor) {
      index = i;
      break;
    }
  }

  return index;
}

function hasField(type, fieldName) {
  return fieldName in type.getFields();
}

/**
 * TODO:
 *   - Document this
 *
 * @param {*} connection
 * @param {*} records
 * @param {*} args
 * @param {*} typeName
 * @param {*} encode
 */
export function getEdges(records, args, typeName, encode = btoa) {
  const { after, before, first, last } = args;
  const afterIndex = getIndexOfRecord(records, after, typeName, encode);
  const beforeIndex = getIndexOfRecord(records, before, typeName, encode);

  if (afterIndex != null) records = records.slice(afterIndex + 1);
  if (beforeIndex != null) records = records.slice(0, beforeIndex);
  if (first != null) records = records.slice(0, first);
  if (last != null) records = records.slice(-last);

  return records.map((record) => ({
    cursor: encode(`${typeName}:${record.id}`),
    node: record,
  }));
}

/**
 * TODO:
 *   - Document this
 *
 * @param {*} connection
 * @param {*} records
 */
export function getPageInfo(records, edges) {
  const pageInfo = {
    hasPreviousPage: false,
    hasNextPage: false,
    startCursor: null,
    endCursor: null,
  };

  if (edges && edges.length) {
    const [firstEdge] = edges;
    const lastEdge = edges[edges.length - 1];

    pageInfo.startCursor = firstEdge.cursor;
    pageInfo.endCursor = lastEdge.cursor;
    pageInfo.hasPreviousPage = firstEdge.node.id !== records[0].id;
    pageInfo.hasNextPage = lastEdge.node.id !== records[records.length - 1].id;
  }

  return pageInfo;
}

/**
 * TODO: Document this
 *
 * @param {*} args
 */
export function getRelayArgs(args) {
  return Object.keys(args).reduce(
    function (separatedArgs, arg) {
      const argsSet = RELAY_ARGS.includes(arg) ? "relayArgs" : "nonRelayArgs";

      separatedArgs[argsSet][arg] = args[arg];

      return separatedArgs;
    },
    { relayArgs: {}, nonRelayArgs: {} }
  );
}

/**
 * Utility function to determine if a given type is a Relay connection
 *
 * @param {Object} type
 */
export function isRelayConnectionType(type) {
  return type.name.endsWith("Connection") && hasField(type, "edges");
}

/**
 * Utility function to determine if a given type is a Relay connection edge
 *
 * @param {Object} type
 */
export function isRelayEdgeType(type) {
  return type.name.endsWith("Edge") && hasField(type, "node");
}

/**
 * Utility function to determine if a given type is Relay connection page info
 *
 * TODO:
 *   - Test this
 *
 * @param {Object} type
 */
export function isRelayPageInfoType(type) {
  return type.name === "PageInfo" && hasField(type, "startCursor");
}

/**
 * Utility function to determine if a given type is a Relay connection, a Relay
 * connection edge or Relay connection page info
 *
 * @param {Object} type
 */
export function isRelayType(type) {
  return (
    type.name &&
    (isRelayConnectionType(type) ||
      isRelayEdgeType(type) ||
      isRelayPageInfoType(type))
  );
}
