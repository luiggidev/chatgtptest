module.exports = {
  testEnvironment: "node",
  transform: {},
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  transformIgnorePatterns: ["/node_modules/(?!.*\\.mjs$)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"],
};
