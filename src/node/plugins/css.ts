import { readFile } from "fs-extra";
import { Plugin } from "../plugin";

export function cssPlugin(): Plugin {
  return {
    name: "m-vite:css",
    load(id) {
      if (id.endsWith(".css")) {
        return readFile(id, "utf-8");
      }
    },
    async transform(code, id) {
      if (id.endsWith(".css")) {
        // 包装成 JS 模块
        const jsContent = `
  const css = "${code.replace(/\n/g, "")}";
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css;
  document.head.appendChild(style);
  export default css;
  `.trim();
        return {
          code: jsContent,
        };
      }
      return null;
    },
  };
}
