import { adaptRecords, getRecords } from "../orm/records";
import { isRelayEdgeType } from "../relay-pagination";
import { resolveRelayEdges } from "./relay";

/**
 * TODO:
 *   - Document this
 *   - Test this
 *
 * @param {*} obj
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} type
 */
export default function resolveList(obj, args, context, info, type) {
  return isRelayEdgeType(type)
    ? resolveRelayEdges(obj, type, context.mirageSchema)
    : obj
    ? adaptRecords(obj[info.fieldName].models, type.name)
    : getRecords(type, args, context.mirageSchema);
}
