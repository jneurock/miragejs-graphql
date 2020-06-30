import {
  Model,
  belongsTo,
  hasMany,
  _utilsInflectorCamelize as camelize,
} from "miragejs";
import { isInterfaceType, isUnionType, isObjectType } from "graphql";
import { isRelayType } from "../relay-pagination";
import { unwrapType } from "../utils";

const ASSOCIATION_TYPE_CHECKS = [isInterfaceType, isObjectType, isUnionType];

function isAssociationType(type) {
  return ASSOCIATION_TYPE_CHECKS.find((checkType) => checkType(type));
}

function createAssociationOptionsForFields(fields) {
  return function (associationOptions, fieldName) {
    const fieldType = fields[fieldName].type;
    const { isList, type: unwrappedType } = unwrapType(fieldType, {
      considerRelay: true,
    });

    if (isAssociationType(unwrappedType)) {
      const associationName = camelize(unwrappedType.name);
      const options = {
        polymorphic:
          isInterfaceType(unwrappedType) || isUnionType(unwrappedType),
      };

      associationOptions[fieldName] = isList
        ? hasMany(associationName, options)
        : belongsTo(associationName, options);
    }

    return associationOptions;
  };
}

function createAssociationOptions(type) {
  const fields = type.getFields();
  const associationOptions = Object.keys(fields).reduce(
    createAssociationOptionsForFields(fields),
    {}
  );

  return associationOptions;
}

function ensureModel(mirageSchema, type) {
  const associationOptions = createAssociationOptions(type);
  const model = Model.extend(associationOptions);

  mirageSchema.registerModel(type.name, model);
}

function shouldAddModel(mirageSchema, type) {
  return (
    !mirageSchema.hasModelForModelName(type.name) &&
    isObjectType(type) &&
    !isRelayType(type) &&
    !type.name.startsWith("__")
  );
}

/**
 * TODO:
 *   - Document this
 *
 * @param {Object} options
 */
export function ensureModels({ graphQLSchema, mirageSchema }) {
  const graphQLSchemaQueryTypes = [
    graphQLSchema.getMutationType(),
    graphQLSchema.getQueryType(),
    graphQLSchema.getSubscriptionType(),
  ];
  const typeMap = graphQLSchema.getTypeMap();

  Object.keys(typeMap).forEach(function (typeName) {
    const { type } = unwrapType(typeMap[typeName]);
    const isQueryType = graphQLSchemaQueryTypes.includes(type);

    if (shouldAddModel(mirageSchema, type) && !isQueryType) {
      ensureModel(mirageSchema, type);
    }
  });
}
