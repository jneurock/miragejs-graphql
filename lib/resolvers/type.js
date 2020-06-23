import { defaultTypeResolver } from "graphql";
import getOptionalResolver from "./optional";

/**
 * TODO: Document this
 *
 * @param {*} resolvers
 */
export default function createTypeResolver(optionalResolvers) {
  return function typeResolver(_obj, _context, info) {
    const optionalResolver = getOptionalResolver(info, optionalResolvers);

    if (optionalResolver) {
      return optionalResolver(...arguments);
    }

    return defaultTypeResolver(...arguments);
  };
}
