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
  const collectionName = mirageSchema.toCollectionName(type.name);
  const records = mirageSchema[collectionName].where(args).models;

  return adaptRecords(records, type.name);
}
