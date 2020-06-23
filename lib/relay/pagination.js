const RELAY_ARGS = ["after", "before", "first", "last"];

function findIndexOfRelayEdge(edges, cursor) {
  let index = 0;

  for (let i = 0; i < edges.length; i++) {
    if (edges[i].node.cursor === cursor) {
      index = i + 1; // TODO: This works for start cursor, does it work for end?
      break;
    }
  }

  return index;
}

function hasField(type, fieldName) {
  return fieldName in type.getFields();
}

function isRelayPageInfoType(type) {
  return type.name === "PageInfo" && hasField(type, "startCursor");
}

/**
 * TODO: Document this
 *
 * @param {*} edges
 * @param {*} relayArgs
 */
export function filterEdges(edges, relayArgs) {
  const { after, before, first, last } = relayArgs;
  const startIndex = after != null ? findIndexOfRelayEdge(edges, after) : 0;
  const endIndex = before != null ? findIndexOfRelayEdge(edges, before) : 0;

  if (first != null) edges = edges.slice(startIndex, startIndex + first);
  if (last != null) edges = edges.slice(endIndex, endIndex - last);

  return edges;
}

/**
 * TODO: Document this
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
 * Utility function to determine if a given type is a Relay connection, a Relay
 * connection edge or Relay connection page info
 *
 * @param {Object} type
 */
export function isRelayType(type) {
  return (
    isRelayConnectionType(type) ||
    isRelayEdgeType(type) ||
    isRelayPageInfoType(type)
  );
}
