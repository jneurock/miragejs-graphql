import relayConnectionQuery from "@tests/gql/queries/relay-connection.gql";
import { query, startServer } from "@tests/integration/setup";

let server;

describe("Integration | queries | Relay connection", function () {
  beforeEach(function () {
    server = startServer();
  });

  afterEach(function () {
    server.shutdown();
  });

  test("query for Relay connection", async function () {
    server.createList("test-relay-node", 2);

    const { testRelayConnection } = await query(relayConnectionQuery);

    expect(testRelayConnection).toEqual({
      edges: [
        {
          cursor: "dW5kZWZpbmVkOjE=",
          node: { id: "1" },
        },
        {
          cursor: "dW5kZWZpbmVkOjI=",
          node: { id: "2" },
        },
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: "dW5kZWZpbmVkOjE=",
        endCursor: "dW5kZWZpbmVkOjI=",
      },
    });
  });
});
