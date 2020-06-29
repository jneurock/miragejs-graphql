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
 *
 * @param {*} record
 * @param {*} typeName
 */
export function adaptRecord(record, typeName) {
  if (record == null) return;

  const { attrs, associations } = record;
  const clone = { ...attrs, __typename: typeName };

  for (let field in associations) {
    clone[field] = record[field];
  }

  return clone;
}

/**
 * TODO:
 *   - Document this
 *
 * @param {*} records
 * @param {*} typeName
 */
export function adaptRecords(records, typeName) {
  return records.reduce(function (adaptedRecords, record) {
    return [...adaptedRecords, adaptRecord(record, typeName)];
  }, []);
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

  return adaptRecords(records, type.name);
}
