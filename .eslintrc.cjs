module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "react-app/jest",
    "prettier",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react-redux",
            importNames: ["useDispatch", "useSelector"],
            message: "Use `useAppDispatch` or `useAppSelector` instead",
          },
        ],
      },
    ],
  },
  reportUnusedDisableDirectives: true,
};
