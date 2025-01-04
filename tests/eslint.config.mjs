import cypressDev from "@cypress/eslint-plugin-dev";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "plugin:@cypress/dev/general",
    "plugin:@cypress/dev/tests",
    "../.eslintrc.json",
), {
    plugins: {
        "@cypress/dev": cypressDev,
    },

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: "./tests/tsconfig.json",
        },
    },

    rules: {
        "no-console": "off",
        curly: "off",
    },
}];