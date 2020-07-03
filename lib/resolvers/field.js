import mirageGraphQLFieldResolver from "./mirage";

function getOptionalResolver(info, optionalResolvers) {
  const { fieldName, parentType } = info;

  return (
    optionalResolvers &&
    optionalResolvers[parentType.name] &&
    optionalResolvers[parentType.name][fieldName]
  );
}

/**
 * TODO:
 *   - Document this
 *
 * @param {Object} optionalResolvers
 */
export default function createFieldResolver(optionalResolvers) {
  return function fieldResolver(_obj, _args, _context, info) {
    const optionalResolver = getOptionalResolver(info, optionalResolvers);

    if (optionalResolver) {
      return optionalResolver(...arguments);
    }

    return mirageGraphQLFieldResolver(...arguments);
  };
}
