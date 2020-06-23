import { getRecords } from "../orm";
import { isRelayEdgeType } from "../relay";
import { resolveRelayEdges } from "./relay";

export default function resolveList(obj, args, context, info, type) {
  if (isRelayEdgeType(type)) {
    return resolveRelayEdges(obj, context.mirageSchema, type);
  }

  if (obj) {
    return obj[info.fieldName].models;
  }

  return getRecords(type, args, context.mirageSchema);
}
