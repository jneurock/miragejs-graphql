import {
  getRelayArgs,
  isRelayConnectionType,
  isRelayEdgeType,
  isRelayType,
} from "@lib/relay/pagination";

describe("Unit | Relay | pagination", function () {
  const connectionType = {
    name: "RelayConnection",
    getFields: () => ({ edges: [] }),
  };
  const edgeType = {
    name: "RelayEdge",
    getFields: () => ({ node: {} }),
  };

  describe("is Relay type", function () {
    test("if Relay connection", function () {
      expect(isRelayType(connectionType)).toBe(true);
    });

    test("if Relay edge type", function () {
      expect(isRelayType(edgeType)).toBe(true);
    });

    test("if Relay page info type", function () {
      const pageInfoType = {
        name: "PageInfo",
        getFields: () => ({ startCursor: "" }),
      };

      expect(isRelayType(pageInfoType)).toBe(true);
    });

    test("if non Relay type", function () {
      const nonRelayType = { name: "Foo" };
      const otherNonRelayType = { name: "Connection", getFields: () => ({})};

      expect(isRelayType(nonRelayType)).toBe(false);
      expect(isRelayType(otherNonRelayType)).toBe(false);
    });
  });

  it("can determine if a type is a Relay connection", function () {
    expect(isRelayConnectionType(connectionType)).toBe(true);
    expect(isRelayConnectionType(edgeType)).toBe(false);
  });

  it("can determine if a type is a Relay edge", function () {
    expect(isRelayEdgeType(edgeType)).toBe(true);
    expect(isRelayConnectionType(edgeType)).toBe(false);
  });

  it("can separate Relay pagination arguments", function () {
    const args = {
      first: 10,
      last: 10,
      after: "12345",
      before: "54321",
      foo: "bar",
    };
    const { relayArgs, nonRelayArgs } = getRelayArgs(args);

    expect(nonRelayArgs).toEqual({ foo: "bar" });
    expect(relayArgs).toEqual({
      first: 10,
      last: 10,
      after: "12345",
      before: "54321",
    });
  });
});
