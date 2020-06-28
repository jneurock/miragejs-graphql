import gql from "graphql-tag";

export default gql`
  input TestObjectInput {
    name: String
  }

  interface Node {
    id: ID!
  }

  interface RelayConnection {
    pageInfo: PageInfo!
  }

  interface RelayEdge {
    cursor: String!
  }

  interface RelayNode {
    id: ID!
  }

  type Mutation {
    createTestObject(input: TestObjectInput!): TestObject
    deleteTestObject(id: ID!): Boolean
    optionallyMutateTestObject(id: ID!, input: TestObjectInput!): TestObject
    updateTestObject(id: ID!, input: TestObjectInput!): TestObject
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    startCursor: String
  }

  type Query {
    node(id: ID!): Node!
    testObject(id: ID!): TestObject
    testObjectNonNull(id: ID!): TestObject!
    testObjects: [TestObject]
    testObjectsNonNull: [TestObject]!
    testObjectsNestedNonNull: [TestObject!]!
    testRelayConnection(
      first: Int
      last: Int
      before: String
      after: String
    ): TestRelayConnection
    testRelayConnectionNonNull(
      first: Int
      last: Int
      before: String
      after: String
    ): TestRelayConnection!
    testNonNullEdgesRelayConnection(
      first: Int
      last: Int
      before: String
      after: String
    ): TestNonNullEdgesRelayConnection
    testNonNullNodesRelayConnection(
      first: Int
      last: Int
      before: String
      after: String
    ): TestNonNullNodesRelayConnection
    testScalar: String
    testScalarNonNull: String!
    testScalarOptionalResolve: String
    testUnion: [TestUnion]
    testUnionNonNull: [TestUnion]!
    testUnionNestedNonNull: [TestUnion!]!
  }

  type TestCategory {
    id: ID!
    name: String!
  }

  type TestNode implements Node {
    name: String!
  }

  type TestObject {
    id: ID!
    category: TestCategory
    categoryNonNull: TestCategory!
    interfaceField: Node
    interfaceNonNullField: Node!
    optionsField: [TestOption]
    optionsNonNullField: [TestOption]!
    optionNestedNonNullField: [TestOption!]!
    relayConnectionField: TestRelayConnection
    relayConnectionNonNullField: TestRelayConnection!
    scalarField: String
    scalarNonNullField: String!
    unionField: [TestUnion]
    unionNonNullField: [TestUnion]!
    unionNestedNonNullField: [TestUnion!]!
  }

  type TestOption {
    id: ID!
    name: String!
  }

  type TestRelayConnection implements RelayConnection {
    edges: [TestRelayEdge]
  }

  type TestNonNullEdgesRelayConnection implements RelayConnection {
    edges: [TestRelayEdge!]!
  }

  type TestNonNullNodesRelayConnection implements RelayConnection {
    edges: [TestNonNullNodesRelayEdge]
  }

  type TestRelayEdge implements RelayEdge {
    node: TestRelayNode
  }

  type TestNonNullNodesRelayEdge implements RelayEdge {
    node: TestRelayNode!
  }

  type TestRelayNode implements Node {
    name: String!
  }

  type TestUnionOne {
    id: ID!
    oneName: String
  }

  type TestUnionTwo {
    id: ID!
    twoName: String
  }

  union TestUnion = TestUnionOne | TestUnionTwo
`;
