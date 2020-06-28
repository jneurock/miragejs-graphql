import { GraphQLObjectType, GraphQLScalarType, buildSchema } from "graphql";
import graphQLSchema from "@tests/gql/schema";
import {
  ensureExecutableGraphQLSchema,
  unwrapInterfaceType,
  unwrapType,
} from "@lib/utils";

describe("Unit | utils", function () {
  const schema = ensureExecutableGraphQLSchema(graphQLSchema);
  const typeMap = schema.getTypeMap();
  const queryFields = typeMap.Query.getFields();

  describe("ensure exectuable GraphQL schema", function () {
    test("if the schema is an AST", function () {
      const { scalarField } = typeMap.TestObject.getFields();
      const { testObject } = typeMap.Query.getFields();

      expect(scalarField.name).toBe("scalarField");
      expect(scalarField.type).toBeInstanceOf(GraphQLScalarType);
      expect(testObject.name).toBe("testObject");
      expect(testObject.type).toBeInstanceOf(GraphQLObjectType);
    });

    test("if the schema is a string", function () {
      const schema = `
      type Foo {
        bar: String
      }

      type Query {
        foo: Foo
      }
      `;
      const exectuableSchema = ensureExecutableGraphQLSchema(schema);
      const typeMap = exectuableSchema.getTypeMap();
      const { bar } = typeMap.Foo.getFields();
      const { foo } = typeMap.Query.getFields();

      expect(bar.name).toBe("bar");
      expect(bar.type).toBeInstanceOf(GraphQLScalarType);
      expect(foo.name).toBe("foo");
      expect(foo.type).toBeInstanceOf(GraphQLObjectType);
    });

    test("if the schema is already executable", function () {
      const schema = buildSchema(`
      type Foo {
        bar: String
      }

      type Query {
        foo: Foo
      }
      `);
      const exectuableSchema = ensureExecutableGraphQLSchema(schema);
      const typeMap = exectuableSchema.getTypeMap();
      const { bar } = typeMap.Foo.getFields();
      const { foo } = typeMap.Query.getFields();

      expect(bar.name).toBe("bar");
      expect(bar.type).toBeInstanceOf(GraphQLScalarType);
      expect(foo.name).toBe("foo");
      expect(foo.type).toBeInstanceOf(GraphQLObjectType);
    });
  });

  it("can unwrap an interface type based on resolver info", function () {
    const Foo = {};
    const selection = {
      kind: "InlineFragment",
      typeCondition: { name: { value: "Foo" } },
    };
    const info = {
      fieldNodes: [{ selectionSet: { selections: [selection] } }],
      schema: {
        getTypeMap: () => ({ Foo }),
      },
    };

    expect(unwrapInterfaceType(info)).toEqual(Foo);
  });

  describe("unwrap type", function () {
    it("can unwrap non-null types", function () {
      const { type: nonNullType } = queryFields.testObjectNonNull;
      const type = typeMap.TestObject;

      expect(unwrapType(nonNullType)).toEqual({ isList: false, type });
    });

    it("can unwrap list types", function () {
      const { type: listType } = queryFields.testObjects;
      const type = typeMap.TestObject;

      expect(unwrapType(listType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list", function () {
      const { type: nonNullListType } = queryFields.testObjectsNonNull;
      const type = typeMap.TestObject;

      expect(unwrapType(nonNullListType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list of non-null types", function () {
      const {
        type: nonNullListOfNonNullType,
      } = queryFields.testObjectsNestedNonNull;
      const type = typeMap.TestObject;

      expect(unwrapType(nonNullListOfNonNullType)).toEqual({
        isList: true,
        type,
      });
    });

    it("can unwrap Relay node types", function () {
      const { type: connectionType } = queryFields.testRelayConnection;
      const nodeType = typeMap.TestRelayNode;

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });

    it("can unwrap non-null Relay edges", function () {
      const {
        type: connectionType,
      } = queryFields.testNonNullEdgesRelayConnection;
      const nonNullNodeType = typeMap.TestRelayNode;

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nonNullNodeType,
      });
    });

    it("can unwrap non-null Relay nodes", function () {
      const {
        type: connectionType,
      } = queryFields.testNonNullNodesRelayConnection;
      const nonNullNodeType = typeMap.TestRelayNode;

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nonNullNodeType,
      });
    });
  });
});
