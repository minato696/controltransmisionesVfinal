module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Desactivar completamente reglas problemáticas
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "@next/next/no-img-element": "off",
    "prefer-const": "off"
  }
};
