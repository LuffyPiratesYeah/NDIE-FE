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
      // 사용하지 않는 변수 무시
      "@typescript-eslint/no-unused-vars": "off",
      // <img> 대신 next/image 권장 경고 무시
      "@next/next/no-img-element": "off",
      // useEffect 의존성 배열 경고 무시
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;