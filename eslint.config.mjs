import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  [
    {
      ignores: ["public/bundle.js"],
      files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions:
      {
        globals: {
          ...globals.browser,
          ...globals.node,
          $: "readonly",
        }
      }
    },
  ]);
