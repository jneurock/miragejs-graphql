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

function resolveFromImplementations(obj, args, context, info, type) {
  const { objects: implementations } = info.schema.getImplementations(type);

  return implementations
    .map((implType) => resolveObject(obj, args, context, info, implType))
    .find((record) => record != null);
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
export default function resolveInterface(obj, args, context, info, type) {
  const implType = getTypeFromInlineFragment(info);

  return implType
    ? resolveObject(obj, args, context, info, implType)
    : resolveFromImplementations(obj, args, context, info, type);
}
