import { getEdges, getPageInfo, getRelayArgs } from "../relay-pagination";
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
export function resolveRelayConnection(obj, args, context, info, type) {
  const { edges: edgesField } = type.getFields();
  const { type: edgeType } = unwrapType(edgesField.type);
  const { relayArgs, nonRelayArgs } = getRelayArgs(args);
  const { type: nodeType } = unwrapType(edgeType.getFields().node.type);
  const records =
    obj && obj[info.fieldName] && obj[info.fieldName].models
      ? adaptRecords(obj[info.fieldName].models, nodeType.name)
      : getRecords(nodeType, nonRelayArgs, context.mirageSchema);
  const edges = getEdges(records, relayArgs, nodeType.name);

  return {
    edges,
    pageInfo: getPageInfo(records, edges),
  };
}

/**
 * TODO:
 *   - Document this
 *   - Test this
 *   - Do we even need this?
 *
 * @param {*} obj
 * @param {*} edgeType
 * @param {*} mirageSchema
 */
// export function resolveRelayEdges(obj, edgeType, mirageSchema) {
//   const { args, relatedRecords } = obj.__relayPaginationInfo;
//   const { relayArgs, nonRelayArgs } = getRelayArgs(args);
//   const { type: nodeType } = unwrapType(edgeType.getFields().node.type);
//   const records = relatedRecords
//     ? adaptRecords(relatedRecords, nodeType.name)
//     : getRecords(nodeType, nonRelayArgs, mirageSchema);

//   setEdges(obj, records, relayArgs, nodeType.name);
//   setPageInfo(obj, records);

//   return obj.edges;
// }
