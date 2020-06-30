import { isInterfaceType, isObjectType, isUnionType } from "graphql";
import resolveDefault from "./default";
import resolveList from "./list";
import resolveObject from "./object";
import resolveInterface from "./interface";
import resolveUnion from "./union";
import { unwrapType } from "../utils";

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

  return isInterfaceType(type)
    ? resolveInterface(obj, args, context, info, type)
    : isUnionType(type)
    ? resolveUnion(obj, args, context, info, type)
    : !isObjectType(type)
    ? resolveDefault(...arguments)
    : isList
    ? resolveList(obj, args, context, info, type)
    : resolveObject(obj, args, context, info, type);
}
