import fs from "fs-extra";
const { readFile } = fs;
import { Plugin } from "../plugin";
import { isJSRequest } from "../utils";
import { transform } from "rolldown/utils";
import path from "path";

export function rolldownTransformPlugin(): Plugin {
  return {
    name: "m-vite:rolldown-transform",
    async load(id) {
      if (isJSRequest(id)) {
        try {
          const code = await readFile(id, "utf-8");
          return code;
        } catch (e) {
          return null;
        }
      }
    },
    async transform(code, id) {
      if (isJSRequest(id)) {
        const extname = path.extname(id).slice(1);
        const { code: transformedCode, map } = await transform(id, code, {
          lang: extname as "js" | "ts" | "jsx" | "tsx",
          sourcemap: true,
        });
        return {
          code: transformedCode,
          map,
        };
      }
      return null;
    },
  };
}
