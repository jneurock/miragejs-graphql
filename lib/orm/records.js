import { setTypename } from "../utils";

function getArgsForCollection(args, type) {
  const fields = type.getFields();

  return Object.keys(args).reduce(function (argsForCollection, arg) {
    if (args[arg] != null && arg in fields) {
      argsForCollection[arg] = args[arg];
    }

    return argsForCollection;
  }, {});
}

/**
 * TODO:
 *   - Document this
 *   - Test: it can clone a record with associations
 *
 * @param {Object} record
 */
export function cloneRecord(record) {
  const { attrs, associations } = record;
  const clone = { ...attrs };

  for (let field in associations) {
    clone[field] = record[field];
  }

  return clone;
}

/**
 * TODO: Document this
 *
 * @param {*} type
 * @param {*} args
 * @param {*} mirageSchema
 */
export function getRecords(type, args, mirageSchema) {
  const collectionArgs = getArgsForCollection(args, type);
  const collectionName = mirageSchema.toCollectionName(type.name);
  const records = mirageSchema[collectionName].where(collectionArgs).models;

  return records.map((record) => setTypename(cloneRecord(record), type.name));
}
