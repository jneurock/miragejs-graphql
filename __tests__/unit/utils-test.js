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
      const { age } = typeMap.Human.getFields();
      const { humanLeader } = typeMap.Query.getFields();

      expect(age.name).toBe("age");
      expect(age.type).toBeInstanceOf(GraphQLScalarType);
      expect(humanLeader.name).toBe("humanLeader");
      expect(humanLeader.type).toBeInstanceOf(GraphQLObjectType);
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
      const { type: nonNullType } = queryFields.nonHumanLeader;
      const type = typeMap.NonHuman;

      expect(unwrapType(nonNullType)).toEqual({ isList: false, type });
    });

    it("can unwrap list types", function () {
      const { type: listType } = queryFields.swords;
      const type = typeMap.Sword;

      expect(unwrapType(listType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list", function () {
      const { type: nonNullListType } = queryFields.horses;
      const type = typeMap.Horse;

      expect(unwrapType(nonNullListType)).toEqual({ isList: true, type });
    });

    it("can unwrap a non-null list of non-null types", function () {
      const { type: nonNullListOfNonNullType } = queryFields.locations;
      const type = typeMap.Location;

      expect(unwrapType(nonNullListOfNonNullType)).toEqual({
        isList: true,
        type,
      });
    });

    it("can unwrap Relay node types", function () {
      const { type: connectionType } = queryFields.accessories;
      const nodeType = typeMap.Accessory;

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nodeType,
      });
    });

    it("can unwrap non-null Relay edges and non-null Relay nodes", function () {
      const { type: connectionType } = queryFields.humans;
      const nonNullNodeType = typeMap.Human;

      expect(unwrapType(connectionType, { considerRelay: true })).toEqual({
        isList: true,
        type: nonNullNodeType,
      });
    });
  });
});
