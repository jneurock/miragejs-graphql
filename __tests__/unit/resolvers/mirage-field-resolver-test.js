/**
 * TODO:
 *   - Use the test schema
 */

jest.mock("@lib/resolvers/default");
jest.mock("@lib/resolvers/list");
jest.mock("@lib/resolvers/object");
jest.mock("@lib/resolvers/union");

import mirageGraphQLFieldResolver from "@lib/resolvers/mirage";
import resolveDefault from "@lib/resolvers/default";
import resolveList from "@lib/resolvers/list";
import resolveObject from "@lib/resolvers/object";
import resolveUnion from "@lib/resolvers/union";
import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from "graphql";

describe("Unit | resolvers | mirage field resolver", function () {
  const obj = {};
  const args = {};
  const context = {};

  describe("object types", function () {
    const type = new GraphQLObjectType({ name: "Foo" });

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
      const nonNullType = new GraphQLNonNull(type);
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
      const listType = new GraphQLList(type);
      const info = { returnType: listType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveList).toHaveBeenCalledWith(obj, args, context, info, type);
    });
  });

  describe("polymorphic types", function () {
    it("can resolve union types", function () {
      const type1 = new GraphQLObjectType({ name: "Foo" });
      const type2 = new GraphQLObjectType({ name: "Bar" });
      const unionType = new GraphQLUnionType(type1, type2);
      const info = { returnType: unionType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveUnion).toHaveBeenCalledWith(
        obj,
        args,
        context,
        info,
        unionType
      );
    });

    it("can resolver interface types", function () {
      const type = new GraphQLObjectType({ name: "Foo" });
      const interfaceType = new GraphQLInterfaceType(type);
      const selection = {
        kind: "InlineFragment",
        typeCondition: { name: { value: "Foo" } },
      };
      const info = {
        fieldNodes: [{ selectionSet: { selections: [selection] } }],
        returnType: interfaceType,
        schema: { getTypeMap: () => ({ Foo: type }) },
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
      const type = new GraphQLScalarType({ name: "Int", parseValue: 1 });
      const info = { returnType: type };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveDefault).toHaveBeenCalledWith(obj, args, context, info);
    });

    it("can resolve non-null scalar types", function () {
      const type = new GraphQLScalarType({ name: "Int", parseValue: 1 });
      const nonNullType = new GraphQLNonNull(type);
      const info = { returnType: nonNullType };

      mirageGraphQLFieldResolver(obj, args, context, info);

      expect(resolveDefault).toHaveBeenCalledWith(obj, args, context, info);
    });
  });
});
