import gql from "graphql-tag";

/**
# TODO: What do we need for integration tests?
#   - Nested level
#     - scalars (Human)
#     - belongsTo (Horse -> Human)
#     - belongsTo interface type (Human -> Animal<Creature>)
#     - belongsTo non-null (Location -> Realm)
#     - hasMany (Realm -> Location)
#     - hasMany non-null (Maiar -> Ability)
#     - hasMany union types (Human -> Friends<Character>)
#     - Relay connection (Human -> AccessoryConnection)
*/

export default gql`
  input ElfInput {
    age: Int
    name: String!
  }

  interface Creature {
    age: Int
    name: String!
  }

  interface Node {
    id: ID!
  }

  type Ability {
    category: String!
    name: String!
  }

  type Accessory {
    category: String!
    name: String!
  }

  type AccessoryConnection {
    edges: [AccessoryEdge]
    pageInfo: PageInfo
  }

  type AccessoryEdge {
    cursor: String!
    node: Accessory
  }

  type Dwarf {
    age: Int
    name: String!
  }

  type Elf {
    age: Int
    name: String!
  }

  type Horse implements Creature {
    color: String!
    human: Human
  }

  type Human implements Node {
    accessories(
      first: Int
      last: Int
      after: String
      before: String
    ): AccessoryConnection
    age: Int
    animal: Creature
    friends: [Character]
    name: String!
  }

  type HumanConnection {
    edges: [HumanEdge!]!
    pageInfo: PageInfo
  }

  type HumanEdge {
    cursor: String!
    node: Human!
  }

  type Location {
    name: String!
    realm: Realm!
  }

  type Maiar {
    abilities: [Ability!]!
    name: String!
  }

  type Mutation {
    """
    Create an Elf

    Test case: Auto-mutation for create
    """
    createElf(elfInput: ElfInput!): Elf

    """
    Delete an Elf

    Test case: Auto-mutation for delete
    """
    deleteElf(id: ID!): Boolean

    """
    Defeat Sauron

    Test case: Optional mutation
    """
    defeatSauron(method: String!): Boolean

    """
    Update an Elf

    Test case: Auto-mutation for update
    """
    updateElf(id: ID!, elfInput: ElfInput!): Elf
  }

  type NonHuman {
    category: String!
    name: String!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    startCursor: String
  }

  type Query {
    """
    Gets a list of accessories

    Test case: Top level Relay connection
    """
    accessories(
      first: Int
      last: Int
      after: String
      before: String
    ): AccessoryConnection

    """
    Gets a creature by ID

    Test case: Non-null interface type
    """
    creature(id: ID!): Creature!

    """
    Gets a list of characters

    Test case: Union type
    """
    characters: [Character]

    """
    The number of characters in The Fellowship

    Test case: Top level scalar type
    """
    fellowshipCount: Int

    """
    Gets a list of horses

    Test case: Top level non-null list
    """
    horses: [Horse]!

    """
    Get the leader of the human characters

    Test case: Object type
    """
    humanLeader: Human

    """
    Gets a list of human characters

    Test case: Top level Relay connection with non-null edges and non-null nodes
    """
    humans(
      first: Int
      last: Int
      before: String
      after: String
    ): HumanConnection

    """
    Gets a list of locations

    Test case: A non-null list of non-null object types
    """
    locations: [Location!]!

    """
    The interface type for Relay connections
    """
    node(id: ID!): Node

    """
    Gets the leader of non-human characters

    Test case: A non-null object type
    """
    nonHumanLeader: NonHuman!

    """
    Gets a list of non-human characters

    Test case: A non-null list of non-null union types
    """
    nonHumans: [NonHuman!]!

    """
    The number of rings

    Test case: A top level scalar type to be found on the root object
    """
    ringsCount: Int

    """
    Gets a list of swords

    Test case: A list of object types
    """
    swords: [Sword]
  }

  type Realm {
    locations: [Location]
    name: String!
  }

  type Sword {
    name: String!
  }

  union Character = Creature | Dwarf | Elf | Human | Maiar
`;
