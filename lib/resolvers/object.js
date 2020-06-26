import { adaptRecord } from "../orm";
import { isRelayConnectionType } from "../relay";
import { resolveRelayConnection } from "./relay";

function findRecord(args, context, typeName) {
  const collectionName = context.mirageSchema.toCollectionName(typeName);
  const record = context.mirageSchema[collectionName].findBy(args);

  return adaptRecord(record, typeName);
}

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
export default function resolveObject(obj, args, context, info, type) {
  return isRelayConnectionType(type)
    ? resolveRelayConnection(obj, args, info)
    : obj
    ? adaptRecord(obj[info.fieldName], type.name)
    : findRecord(args, context, type.name);
}
