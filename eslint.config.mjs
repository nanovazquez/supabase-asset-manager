import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),
  {
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "max-len": ["error", { code: 120 }],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
