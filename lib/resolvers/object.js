import { adaptRecord } from "../orm/records";
import { isMutation, resolveMutation } from "./mutation";
import { resolveRelayConnection } from "./relay";
import { unwrapType } from "../utils";
import {
  isRelayConnectionType,
  isRelayEdgeType,
  isRelayPageInfoType,
} from "../relay-pagination";

function findRecord(args, context, typeName) {
  const collectionName = context.mirageSchema.toCollectionName(typeName);
  const record = context.mirageSchema[collectionName].findBy(args);

  return adaptRecord(record, typeName);
}

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
export default function resolveObject(obj, args, context, info, type) {
  const { type: parentType } = unwrapType(info.parentType);

  return isMutation(info)
    ? resolveMutation(args, context, info, type.name)
    : isRelayConnectionType(type)
    ? resolveRelayConnection(obj, args, context, info, type)
    : !obj
    ? findRecord(args, context, type.name)
    : isRelayEdgeType(parentType)
    ? obj.node
    : isRelayPageInfoType(type)
    ? obj.pageInfo
    : adaptRecord(obj[info.fieldName], type.name);
}
