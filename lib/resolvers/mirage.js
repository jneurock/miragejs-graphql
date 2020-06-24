import {
  defaultFieldResolver,
  isInterfaceType,
  isObjectType,
  isUnionType,
} from "graphql";
import resolveList from "./list";
import resolveObject from "./object";
import resolveUnion from "./union";
import { unwrapInterfaceType, unwrapType } from "../utils";

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
export default function mirageGraphQLFieldResolver(obj, args, context, info) {
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
