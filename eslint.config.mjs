import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
  rules: {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-types": "off",
    "@typescript-eslint/no-unused-vars" : "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/exhaustive-deps": "off", // opcional, pero útil si quieres silenciar useEffect
  },
},
];

export default eslintConfig;
