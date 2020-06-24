import { setTypename } from "@lib/utils";

describe("Unit | utils", function () {
  it("can set the __typename of an object", function () {
    const obj = { foo: "bar" };

    setTypename(obj, "Foo");

    expect(obj).toEqual({ foo: "bar", __typename: "Foo" });
  });

  /**
   * TODO:
   *   - test `unwrapInterfaceType`
   *   - test `unwrapType`
   */
});
