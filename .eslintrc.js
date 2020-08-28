module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    ecmaVersion: 2018,
  },
  extends: ["airbnb-base", "eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "class-methods-use-this": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "implicit-arrow-linebreak": "off",
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-plusplus": [1, { allowForLoopAfterthoughts: true }],
    "no-param-reassign": [1, { props: false }],
    "no-return-assign": [1, "except-parens"],
    "no-underscore-dangle": [0, "allow"],
    "no-bitwise": [2, { allow: ["<<", "&=", "&", ">>"] }],
    "consistent-return": [0],
    "func-names": [2, "never"],
    "prettier/prettier": ["error", { singleQuote: false, endOfLine: "auto" }],
  },
};
