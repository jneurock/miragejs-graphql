import { adaptRecords, getRecords } from "../orm/records";
import { isRelayEdgeType } from "../relay-pagination";

/**
 * TODO:
 *   - Document this
 *
 * @param {*} obj
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} type
 */
export default function resolveList(obj, args, context, info, type) {
  return !obj
    ? getRecords(type, args, context.mirageSchema)
    : isRelayEdgeType(type)
    ? obj.edges
    : adaptRecords(obj[info.fieldName].models, type.name);
}
