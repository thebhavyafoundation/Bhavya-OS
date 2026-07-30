import base from "@bhavya/eslint/base";

export default [
  ...base,
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];
