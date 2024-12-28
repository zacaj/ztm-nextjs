import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [{
  ignores: [`**/node_modules/`, `database/migration/**/*`],
}, ...fixupConfigRules(compat.extends(
  `eslint:recommended`,
  `plugin:react/recommended`,
  `plugin:react-hooks/recommended`,
  `next/core-web-vitals`,
)), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    "react-hooks": fixupPluginRules(reactHooks),
    "@stylistic": stylistic,
  },

  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: `module`,

    parserOptions: {
      project: `./tsconfig.json`,
    },
  },

  rules: {
    "@typescript-eslint/await-thenable": `warn`,
    "@typescript-eslint/class-name-casing": `off`,

    "@stylistic/member-delimiter-style": [`warn`, {
      multiline: {
        delimiter: `semi`,
        requireLast: true,
      },

      singleline: {
        requireLast: false,
      },
    }],

    "@typescript-eslint/no-array-constructor": `warn`,
    "@typescript-eslint/no-extra-non-null-assertion": `warn`,

    "@typescript-eslint/no-floating-promises": [`error`, {
      ignoreVoid: true,
    }],

    "@typescript-eslint/no-for-in-array": `warn`,
    "@typescript-eslint/no-misused-new": `warn`,
    "@typescript-eslint/no-unused-expressions": `off`,
    "@typescript-eslint/prefer-for-of": `warn`,
    "@typescript-eslint/prefer-includes": `warn`,
    "@typescript-eslint/prefer-nullish-coalescing": `warn`,
    "@typescript-eslint/prefer-optional-chain": `warn`,
    "@typescript-eslint/prefer-string-starts-ends-with": `off`,
    "@typescript-eslint/require-array-sort-compare": `warn`,
    "@typescript-eslint/restrict-plus-operands": `off`,
    "@typescript-eslint/no-unnecessary-condition": `warn`,

    "@/semi": [`warn`, `always`, {
      omitLastInOneLineBlock: false,
    }],

    "@/space-before-function-paren": [`warn`, {
      asyncArrow: `always`,
      anonymous: `never`,
      named: `never`,
    }],

    "@stylistic/type-annotation-spacing": `warn`,
    "@typescript-eslint/unbound-method": `off`,
    "@typescript-eslint/unified-signatures": `warn`,
    "no-import-assign": `warn`,
    "no-inner-declarations": `off`,
    "no-setter-return": `warn`,
    "no-unreachable": `off`,
    "array-callback-return": `warn`,
    complexity: `warn`,
    "consistent-return": `off`,
    "default-param-last": `off`,
    eqeqeq: `warn`,
    "no-invalid-this": `off`,
    "no-loop-func": `off`,
    "no-return-assign": `off`,
    "no-self-compare": `warn`,
    "no-sequences": `warn`,
    "no-constant-condition": `off`,
    "no-throw-literal": `off`,
    "require-atomic-updates": `off`,
    "no-unused-expressions": `off`,
    "prefer-regex-literals": `warn`,
    radix: `warn`,
    "no-label-var": `warn`,

    "no-use-before-define": [`off`, {
      functions: false,
      classes: false,
    }],

    "no-undefined": `off`,
    "no-undef": `off`,
    "no-unused-vars": `off`,
    "brace-style": `off`,

    "comma-dangle": [`warn`, {
      arrays: `always-multiline`,
      objects: `always-multiline`,
      imports: `always-multiline`,
      exports: `always-multiline`,
      functions: `always-multiline`,
    }],

    "func-call-spacing": `warn`,
    "keyword-spacing": `warn`,
    "linebreak-style": `off`,

    "max-len": [`off`, {
      code: 200,
      tabWidth: 2,
      ignoreComments: true,
      ignorePattern: `^import.*`,
    }],

    "max-params": [`off`, {
      max: 6,
    }],

    "newline-per-chained-call": `off`,
    "no-nested-ternary": `off`,
    "no-new-object": `warn`,
    "no-tabs": `warn`,
    "no-debugger": `off`,

    "no-unneeded-ternary": [`warn`, {
      defaultAssignment: false,
    }],

    "no-whitespace-before-property": `warn`,
    "one-var": [`warn`, `never`],
    quotes: [`off`, `single`],
    semi: `off`,
    "space-before-function-paren": `off`,
    "space-before-blocks": [`warn`, `always`],
    "space-in-parens": [`warn`, `never`],

    "space-unary-ops": [`warn`, {
      words: true,
      nonwords: false,
    }],

    "arrow-spacing": `warn`,
    "no-const-assign": `warn`,
    "no-dupe-class-members": `warn`,
    "no-duplicate-imports": `warn`,
    "no-this-before-super": `warn`,
    "no-var": `warn`,
    "prefer-arrow-callback": `warn`,
    "prefer-const": `warn`,
    "prefer-numeric-literals": `warn`,
    "react/jsx-key": `off`,
    "react-hooks/exhaustive-deps": `warn`,
    "react/button-has-type": `warn`,
    "react/hook-use-state": `warn`,
    "@typescript-eslint/no-unnecessary-type-constraint": `warn`,
    "@typescript-eslint/no-non-null-asserted-optional-chain": `warn`,
    "react/display-name": `off`,
    "import/no-anonymous-default-export": `off`,
    "react/jsx-indent": [`off`, 2],
    "react/jsx-indent-props": [`warn`, 2],

    "react/jsx-max-props-per-line": [`warn`, {
      maximum: 3,
    }],

    "react/jsx-one-expression-per-line": [`warn`, {
      allow: `non-jsx`,
    }],

    "react/jsx-tag-spacing": [`warn`, {
      beforeSelfClosing: `never`,
    }],

    "react/jsx-props-no-multi-spaces": [`warn`],

    "react/jsx-no-leaked-render": [`warn`, {
      validStrategies: [`coerce`, `ternary`],
    }],

    "react/jsx-closing-bracket-location": [`warn`, `tag-aligned`],
    "@stylistic/indent": [`warn`, 2],
    "@stylistic/block-spacing": [`off`],

    "@stylistic/object-curly-spacing": [`warn`, `always`, {
      arraysInObjects: false,
      objectsInObjects: false,
    }],

    "@stylistic/no-whitespace-before-property": [`warn`],

    "@stylistic/object-property-newline": [`warn`, {
      allowAllPropertiesOnSameLine: true,
    }],

    "@stylistic/no-multi-spaces": [`warn`, {
      ignoreEOLComments: true,
    }],

    "@stylistic/space-before-blocks": [`warn`],
    "@stylistic/function-call-spacing": [`warn`],
    "@stylistic/arrow-spacing": [`warn`],
    "@stylistic/comma-spacing": [`warn`],
    "@stylistic/array-bracket-spacing": [`warn`],
    "@stylistic/keyword-spacing": [`warn`],
    "@stylistic/space-in-parens": [`warn`],
    "@stylistic/no-trailing-spaces": [`warn`],
    "@stylistic/key-spacing": [`warn`],
    "@stylistic/computed-property-spacing": [`warn`],
    "@stylistic/template-curly-spacing": [`warn`],
    "@stylistic/switch-colon-spacing": [`warn`],
    "@stylistic/semi-spacing": [`warn`],
    "@stylistic/quotes": [`warn`, `backtick`],
    "@stylistic/rest-spread-spacing": [`warn`],

    "@stylistic/space-before-function-paren": [`warn`, {
      anonymous: `never`,
      named: `never`,
      asyncArrow: `always`,
    }],

    "@stylistic/space-unary-ops": [`warn`, {
      words: true,
      nonwords: false,
    }],
  },
}];