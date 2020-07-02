import objectQuery from "@tests/gql/queries/object.gql";
import objectNonNullQuery from "@tests/gql/queries/object-non-null.gql";
import { query, startServer } from "@tests/integration/setup";

let server;

describe("Integration | queries | object", function () {
  beforeEach(function () {
    server = startServer();
  });

  afterEach(function () {
    server.shutdown();
  });

  test("query for test object", async function () {
    const object = server.create("test-object");
    const { testObject } = await query(objectQuery, {
      variables: { id: object.id },
    });

    expect(testObject).toEqual({ id: object.id });
  });

  test("query for non-null test object", async function () {
    const object = server.create("test-object");
    const { testObjectNonNull } = await query(objectNonNullQuery, {
      variables: { id: object.id },
    });

    expect(testObjectNonNull).toEqual({ id: object.id });
  });
});
