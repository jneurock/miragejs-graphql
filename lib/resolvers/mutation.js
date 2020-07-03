import { unwrapType } from "../utils";
import { isInputObjectType, isSpecifiedScalarType } from "graphql";

function getMutationVarTypes(variableDefinitions, typeMap) {
  return variableDefinitions.reduce(function (vars, definition) {
    const { type: typeInfo } = unwrapType(definition.type.type);
    const type = typeMap[typeInfo.name.value];

    return [...vars, type];
  }, []);
}

function hasCreateVars(varTypes) {
  return varTypes.length === 1 && isInputObjectType(varTypes[0]);
}

function hasDeleteVars(varTypes) {
  return varTypes.length === 1 && isIdVar(varTypes[0]);
}

function hasUpdateVars(varTypes) {
  return (
    varTypes.length === 2 &&
    varTypes.reduce(function (hasUpdateVars, varType) {
      if (hasUpdateVars === false) return hasUpdateVars;

      return isInputObjectType(varType) || isIdVar(varType);
    }, null)
  );
}

function isIdVar(varType) {
  return isSpecifiedScalarType(varType) && varType.name === "ID";
}

function resolveCreateMutation(args, table) {
  const input = args[Object.keys(args)[0]];

  return table.insert(input);
}

function resolveDeleteMutation(args, table) {
  const record = table.find(args.id);

  table.remove(args.id);

  return record;
}

function resolveUpdateMutation(args, table) {
  const input = args[Object.keys(args).find((arg) => arg !== "id")];

  return table.update(args.id, input);
}

function throwUnimplemented(info) {
  throw new Error(
    `Could not find a default resolver for ${info.fieldName}. Please supply a resolver for this mutation.`
  );
}

/**
 * Utility function to determine if a given query is a mutation
 *
 * @param {Object} info
 */
export function isMutation(info) {
  return info.parentType === info.schema.getMutationType();
}

/**
 * TODO:
 *   - Document this
 *
 * @param {*} args
 * @param {*} context
 * @param {*} info
 * @param {*} typeName
 */
export function resolveMutation(args, context, info, typeName) {
  const collectionName = context.mirageSchema.toCollectionName(typeName);
  const table = context.mirageSchema.db[collectionName];
  const varTypes = getMutationVarTypes(
    info.operation.variableDefinitions,
    info.schema.getTypeMap()
  );

  return hasCreateVars(varTypes)
    ? resolveCreateMutation(args, table)
    : hasDeleteVars(varTypes)
    ? resolveDeleteMutation(args, table)
    : hasUpdateVars(varTypes)
    ? resolveUpdateMutation(args, table)
    : throwUnimplemented(info);
}
