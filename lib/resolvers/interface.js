import resolveObject from "./object";

function getTypeFromInlineFragment(info) {
  const selection = info.fieldNodes[0].selectionSet.selections.find(
    ({ kind }) => kind === "InlineFragment"
  );

  if (selection) {
    const {
      typeCondition: {
        name: { value: typeName },
      },
    } = selection;

    return info.schema.getTypeMap()[typeName];
  }
}

/**
 * TODO:
 *   - Document this
 *   - Test this
 *   - Try determining type from inline fragment or by getting all possible
 *     types and returning the first record from the database that matches
 *   - How do we handle records already related to the parent object?
 *
 * @param {*} obj
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} type
 */
export default function resolveInterface(obj, args, context, info, type) {
  const implType = getTypeFromInlineFragment(info);

  if (!implType) {
    // TODO: Try getting a record from all possible types until we find one and
    // assume that's it. Will have to use integration test to get impl types.
    // TODO: Document how we determine the implementation type so people
    // understand that it could be unreliable.
  }

  resolveObject(obj, args, context, info, implType);
}
