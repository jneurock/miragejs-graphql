import {
  defaultFieldResolver,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";
import getOptionalResolver from "./optional";
import resolveList from "./list";
import resolveObject from "./object";
import resolveUnion from "./union";
import { unwrapInterfaceType, unwrapType } from "../utils";

/**
 * TODO:
 *   - Document this function
 *   - Make this usable in user resolvers
 *   - Rename userResolver to something like optionalResolver or similar
 *
 * @param {Object} resolvers
 */
export function createFieldResolver(optionalResolvers) {
  return function fieldResolver(obj, args, context, info) {
    const optionalResolver = getOptionalResolver(info, optionalResolvers);

    if (optionalResolver) {
      return optionalResolver(...arguments);
    }

    return mirageGraphQLFieldResolver(...arguments);
  };
}

/**
 * TODO:
 *   - Document this
 *   - Test this
 *
 * @param {*} obj
 * @param {*} args
 * @param {*} context
 * @param {*} info
 */
export function mirageGraphQLFieldResolver(obj, args, context, info) {
  let { isList, type } = unwrapType(info.returnType);

  if (isInterfaceType(type)) {
    type = unwrapInterfaceType(info);
  }

  return isUnionType(type)
    ? resolveUnion(obj, args, context, info, type)
    : !isObjectType(type)
    ? defaultFieldResolver(...arguments)
    : isList
    ? resolveList(obj, args, context, info, type)
    : resolveObject(obj, args, context, info, type);
}
