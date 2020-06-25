import { GraphQLObjectType, GraphQLScalarType } from "graphql";
import gql from "graphql-tag";
import { setTypename } from "@lib/utils";
import { ensureExecutableGraphQLSchema, unwrapInterfaceType } from "../../lib/utils";

describe("Unit | utils", function () {
  describe("ensure exectuable GraphQL schema", function () {
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

    test("if the schema is a string", function () {
      testSchema(`
      type Foo {
        bar: String
      }

      type Query {
        foo: Foo
      }
      `);
    });

    test("if the schema is an AST", function () {
      testSchema(gql`
      type Foo {
        bar: String
      }

      type Query {
        foo: Foo
      }
      `);
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
        getTypeMap: () => ({ Foo })
      },
    };

    expect(unwrapInterfaceType(info)).toEqual(Foo);
  });

  /**
   * TODO:
   *   - test `unwrapType`
   *   - test `unwrapTypeForModels`
   */
});
