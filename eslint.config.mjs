import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const forbiddenInUseCases = [
  { group: ["next", "next/*"], message: "Use-cases must not depend on Next.js." },
  { group: ["@/shared/db/client"], message: "Use-cases receive repositories by parameter." },
  { group: ["@/modules/*/config/*"], message: "Use-cases must not import auth or config." },
  { group: ["drizzle-orm", "drizzle-orm/*"], message: "Only repositories talk to Drizzle." },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "max-lines": ["error", { max: 150, skipBlankLines: false, skipComments: false }],
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-globals": [
        "error",
        { name: "confirm", message: "Use the in-app ConfirmDialog instead of native dialogs." },
        { name: "alert", message: "Use the in-app ConfirmDialog instead of native dialogs." },
        { name: "prompt", message: "Use the in-app ConfirmDialog instead of native dialogs." },
      ],
      "no-restricted-properties": [
        "error",
        ...["confirm", "alert", "prompt"].flatMap((property) =>
          ["window", "globalThis"].map((object) => ({
            object,
            property,
            message: "Use the in-app ConfirmDialog instead of native dialogs.",
          })),
        ),
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportDeclaration[source.value='react'] > ImportNamespaceSpecifier",
          message: "Import only what you need from react by name.",
        },
      ],
    },
  },
  {
    files: ["src/modules/*/use-cases/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: { "no-restricted-imports": ["error", { patterns: forbiddenInUseCases }] },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    ".scratch/**",
    "src/shared/db/migrations/**",
  ]),
]);

export default eslintConfig;
