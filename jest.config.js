export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js", "**/?(*.)+(spec|test).js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleDirectories: ["node_modules", "src"],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
};
