import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "references/**",
      "docs/**",
      "public/assets/**",
    ],
  },
  ...nextVitals,
];

export default eslintConfig;
