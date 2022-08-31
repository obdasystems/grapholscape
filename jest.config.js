/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // A set of global variables that need to be available in all test environments
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",
  // The test environment that will be used for testing
  testEnvironment: "jsdom",
};
