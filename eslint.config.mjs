// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // 1. Apply the default Next.js configurations first.
  // This includes base rules for React, React Hooks, Next.js, and basic accessibility.
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Add stricter, more opinionated rules.
  // These objects are processed after the defaults, allowing them to add to and override the base config.

  // Stricter accessibility rules
  {
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      // The 'next/core-web-vitals' preset includes 'recommended' rules.
      // We are overriding it here with the 'strict' ruleset for better a11y coverage.
      ...jsxA11yPlugin.configs.strict.rules,
    },
  },

  // Import sorting and organization rules
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
      import: importPlugin,
    },
    rules: {
      // Enforce consistent import order
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Additional import-related best practices
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
];

export default eslintConfig;
