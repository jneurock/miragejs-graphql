jest.mock("@lib/resolvers/default");
jest.mock("@lib/resolvers/list");
jest.mock("@lib/resolvers/object");
jest.mock("@lib/resolvers/union");

import { graphQLSchema } from "@tests/gql/schema";
import mirageGraphQLFieldResolver from "@lib/resolvers/mirage";
import resolveDefault from "@lib/resolvers/default";
import resolveList from "@lib/resolvers/list";
import resolveObject from "@lib/resolvers/object";
import resolveUnion from "@lib/resolvers/union";

describe("Unit | resolvers | mirage field resolver", function () {
  const obj = {};
  const args = {};
  const context = {};
  const typeMap = graphQLSchema.getTypeMap();
  const queryFields = typeMap.Query.getFields();

  describe("object types", function () {
    const { type } = queryFields.testObject;

    it("can resolve an object type", function () {
      const info = { returnType: type };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveObject).toHaveBeenCalledWith(
        obj,
        args,
        context,
        info,
        type
      );
    });

    it("can resolve a non-null object type", function () {
      const { type: nonNullType } = queryFields.testObjectNonNull;
      const info = { returnType: nonNullType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveObject).toHaveBeenCalledWith(
        obj,
        args,
        context,
        info,
        type
      );
    });

    it("can resolve a list of objects", function () {
      const { type: listType } = queryFields.testObjects;
      const info = { returnType: listType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveList).toHaveBeenCalledWith(obj, args, context, info, type);
    });
  });

  describe("polymorphic types", function () {
    it("can resolve union types", function () {
      const {
        type: { ofType: unionType },
      } = queryFields.testUnion;
      const info = { returnType: queryFields.testUnion.type };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveUnion).toHaveBeenCalledWith(
        obj,
        args,
        context,
        info,
        unionType
      );
    });

    it("can resolve interface types", function () {
      const type = typeMap.TestRelayConnection;
      const selection = {
        kind: "InlineFragment",
        typeCondition: { name: { value: "TestRelayConnection" } },
      };
      const info = {
        fieldNodes: [{ selectionSet: { selections: [selection] } }],
        returnType: queryFields.testRelayConnection.type,
        schema: graphQLSchema,
      };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveObject).toHaveBeenCalledWith(
        obj,
        args,
        context,
        info,
        type
      );
    });
  });

  describe("scalar types", function () {
    it("can resolve scalar types", function () {
      const { type } = queryFields.testScalar;
      const info = { returnType: type };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveDefault).toHaveBeenCalledWith(obj, args, context, info);
    });

    it("can resolve non-null scalar types", function () {
      const { type: nonNullType } = queryFields.testScalarNonNull;
      const info = { returnType: nonNullType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveDefault).toHaveBeenCalledWith(obj, args, context, info);
    });
  });
});
