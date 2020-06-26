import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  buildSchema,
} from "graphql";
import gql from "graphql-tag";
import { setTypename } from "@lib/utils";
import {
  ensureExecutableGraphQLSchema,
  unwrapInterfaceType,
  unwrapType,
} from "../../lib/utils";

describe("Unit | utils", function () {
  describe("ensure exectuable GraphQL schema", function () {
    const schema = `
    type Foo {
      bar: String
    }

    type Query {
      foo: Foo
    }
    `;

    function testSchema(schema) {
      const exectuableSchema = ensureExecutableGraphQLSchema(schema);
      const typeMap = exectuableSchema.getTypeMap();
      const { bar } = typeMap.Foo.getFields();
      const { foo } = typeMap.Query.getFields();

      expect(bar.name).toBe("bar");
      expect(bar.type).toBeInstanceOf(GraphQLScalarType);
      expect(foo.name).toBe("foo");
      expect(foo.type).toBeInstanceOf(GraphQLObjectType);
    }

    // eslint-disable-next-line jest/expect-expect
    test("if the schema is a string", function () {
      testSchema(schema);
    });

    // eslint-disable-next-line jest/expect-expect
    test("if the schema is an AST", function () {
      testSchema(gql(schema));
    });

    // eslint-disable-next-line jest/expect-expect
    test("if the schema is already executable", function () {
      testSchema(buildSchema(schema));
    });
  });

  it("can set the __typename of an object", function () {
    const obj = { foo: "bar" };

    setTypename(obj, "Foo");

    expect(obj).toEqual({ foo: "bar", __typename: "Foo" });
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
      const type = new GraphQLObjectType({ name: "Foo" });
      const nonNullType = new GraphQLNonNull(type);

      expect(unwrapType(nonNullType)).toEqual({ isList: false, type });
    });

    it("can unwrap list types", function () {
      const type = new GraphQLObjectType({ name: "Foo" });
      const listType = new GraphQLList(type);

      expect(unwrapType(listType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list", function () {
      const type = new GraphQLObjectType({ name: "Foo" });
      const listType = new GraphQLList(type);
      const nonNullType = new GraphQLNonNull(listType);

      expect(unwrapType(nonNullType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list of non-null types", function () {
      const type = new GraphQLObjectType({ name: "Foo" });
      const nonNullType = new GraphQLNonNull(type);
      const listType = new GraphQLList(nonNullType);
      const nonNullListType = new GraphQLNonNull(listType);

      expect(unwrapType(nonNullListType)).toEqual({ isList: true, type });
    });

    it("can unwrap Relay node types", function () {
      const nodeType = new GraphQLObjectType({ name: "Foo" });
      const edgeType = new GraphQLObjectType({
        fields: { node: { type: nodeType } },
        name: "FooEdge",
      });
      const edgesType = new GraphQLList(edgeType);
      const connectionType = new GraphQLObjectType({
        fields: { edges: { type: edgesType } },
        name: "FooConnection",
      });

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });

    it("can unwrap non-null Relay edges", function () {
      const nodeType = new GraphQLObjectType({ name: "Foo" });
      const edgeType = new GraphQLObjectType({
        fields: { node: { type: nodeType } },
        name: "FooEdge",
      });
      const edgesType = new GraphQLList(edgeType);
      const connectionType = new GraphQLObjectType({
        fields: { edges: { type: new GraphQLNonNull(edgesType) } },
        name: "FooConnection",
      });

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });

    it("can unwrap non-null Relay nodes", function () {
      const nodeType = new GraphQLObjectType({ name: "Foo" });
      const edgeType = new GraphQLObjectType({
        fields: { node: { type: GraphQLNonNull(nodeType) } },
        name: "FooEdge",
      });
      const edgesType = new GraphQLList(edgeType);
      const connectionType = new GraphQLObjectType({
        fields: { edges: { type: edgesType } },
        name: "FooConnection",
      });

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });

    it("can unwrap non-null Relay edges and non-null Relay nodes", function () {
      const nodeType = new GraphQLObjectType({ name: "Foo" });
      const edgeType = new GraphQLObjectType({
        fields: { node: { type: new GraphQLNonNull(nodeType) } },
        name: "FooEdge",
      });
      const edgesType = new GraphQLList(edgeType);
      const connectionType = new GraphQLObjectType({
        fields: { edges: { type: new GraphQLNonNull(edgesType) } },
        name: "FooConnection",
      });

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });
  });
});
