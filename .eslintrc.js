module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "quotes": [2, "double"],
    "indent": 0,
    "sort-imports": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": [
      "warn",
      {
        arrowParens: "always",
        bracketSpacing: true,
        htmlWhitespaceSensitivity: "css",
        insertPragma: false,
        jsxSingleQuote: false,
        proseWrap: "preserve",
        quoteProps: "consistent",
        requirePragma: false,
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        trailingComma: "es5",
        useTabs: false,
        vueIndentScriptAndStyle: false,
        printWidth: 100,
        endOfLine: "auto",
      },
    ],
  },
};
