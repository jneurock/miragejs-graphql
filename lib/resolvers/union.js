import { getRecords } from "../orm/records";

export default function resolveUnion(_obj, args, context, _info, type) {
  const types = type.getTypes();
  const recordsForTypes = types.reduce(function (records, type) {
    return [...records, ...getRecords(type, args, context.mirageSchema)];
  }, []);

  return recordsForTypes;
}
