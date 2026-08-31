/* eslint-disable @typescript-eslint/no-require-imports */
// TypeScript 7 intentionally does not expose the compiler API yet. ESLint's
// TypeScript parser still needs that API, so give this process Microsoft's
// official TypeScript 6 compatibility package while `tsc` and Next use TS7.
const Module = require("node:module");

const load = Module._load;
const typescript6 = load("@typescript/typescript6", module, false);

Module._load = function loadWithTypeScript6(request, parent, isMain) {
  if (request === "typescript") {
    return typescript6;
  }

  return load(request, parent, isMain);
};
