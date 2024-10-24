export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } }, // Automatically detect the React version
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react/jsx-uses-react": "off", // React 17+ doesn't need the import
      "react/react-in-jsx-scope": "off", // React 17+ doesn't need the import
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }], // Ignore unused React import
      "react-hooks/rules-of-hooks": "error", // Enforce React hooks rules
      "react-hooks/exhaustive-deps": "warn", // Warn about dependencies in React hooks
    },
  },
];
