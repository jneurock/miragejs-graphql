module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["lib/**/*.js"],
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/lib/$1",
    "^@tests/(.*)$": "<rootDir>/__tests__/$1",
  },
  testMatch: ["**/__tests__/**/*-test.js"],
  transform: {
    "\\.gql$": "jest-transform-graphql",
    "^.+\\.[t|j]s$": "babel-jest",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
