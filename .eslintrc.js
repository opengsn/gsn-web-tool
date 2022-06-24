module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    mocha: true,
    node: true
  },
  globals: {
    artifacts: false,
    assert: false,
    contract: false,
    web3: false
  },
  extends:
    [
      'standard-with-typescript',
      'plugin:react/recommended'
    ],
  plugins: ["react", "react-hooks"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // The 'tsconfig.packages.json' is needed to add not-compiled files to the project
    project: ['./tsconfig.json']
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off", 
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
    "import/extensions": [".ts", ".tsx"],
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src"],
      },
    },
  },
}