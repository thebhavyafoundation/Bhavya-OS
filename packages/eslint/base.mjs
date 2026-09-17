import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/.next/**", "**/dist/**", "**/node_modules/**", "**/coverage/**", "**/next-env.d.ts"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  }
];
