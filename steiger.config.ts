import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/app/providers/**"],
    rules: {
      "fsd/segments-by-purpose": "off",
    },
  },
  {
    files: ["./src/widgets/users-table/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
