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
  },
  {
    // Standalone Node tooling (scripts/, *.mjs, *.cjs) runs outside the bundler,
    // so Node globals must be declared or js.configs.recommended's no-undef
    // fires on every console.log / process.env / require().
    files: ["**/*.mjs", "**/*.cjs", "**/scripts/**/*.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "writable",
        exports: "writable"
      }
    },
    rules: {
      // CommonJS is valid in plain-JS tooling; the rule exists to keep
      // TypeScript modules on ESM imports.
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];
