import base from "./packages/eslint/base.mjs";

export default [
  ...base,
  {
    ignores: [".next/**", "dist/**", "node_modules/**", "apps/knowledge-studio/**", "apps/github-os/**"]
  }
];
