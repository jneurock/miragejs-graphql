import { cloneRecord } from "../orm";
import { isRelayConnectionType } from "../relay";
import { resolveRelayConnection } from "./relay";
import { setTypename } from "../utils";

export default function resolveObject(obj, args, context, info, type) {
  if (isRelayConnectionType(type)) {
    return resolveRelayConnection(obj, args, info);
  }

  if (obj) {
    return obj[info.fieldName];
  }

  const collectionName = context.mirageSchema.toCollectionName(type.name);
  const record = context.mirageSchema[collectionName].findBy(args);

  return record && setTypename(cloneRecord(record), type.name);
}
