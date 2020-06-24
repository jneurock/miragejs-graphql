import getOptionalResolver from "./optional";
import mirageGraphQLFieldResolver from "./mirage";

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
