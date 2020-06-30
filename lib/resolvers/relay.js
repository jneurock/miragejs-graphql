import { getRelayArgs, setEdges, setPageInfo } from "../relay-pagination";
import { getRecords, adaptRecords } from "../orm/records";
import { unwrapType } from "../utils";

/**
 * TODO:
 *   - Document this
 *   - Test this
 *
 * @param {*} obj
 * @param {*} args
 * @param {*} info
 */
export function resolveRelayConnection(obj, args, info) {
  return {
    edges: [],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null,
    },
    __relayPaginationInfo: {
      args,
      relatedRecords: obj && obj[info.fieldName] && obj[info.fieldName].models,
    },
  };
}

/**
 * TODO:
 *   - Document this
 *   - Test this
 *
 * @param {*} obj
 * @param {*} edgeType
 * @param {*} mirageSchema
 */
export function resolveRelayEdges(obj, edgeType, mirageSchema) {
  const { args, relatedRecords } = obj.__relayPaginationInfo;
  const { relayArgs, nonRelayArgs } = getRelayArgs(args);
  const { type: nodeType } = unwrapType(edgeType.getFields().node.type);
  const records = relatedRecords
    ? adaptRecords(relatedRecords, nodeType.name)
    : getRecords(nodeType, nonRelayArgs, mirageSchema);

  setEdges(obj, records, relayArgs, nodeType.name);
  setPageInfo(obj, records);

  return obj.edges;
}
