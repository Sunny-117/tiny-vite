import { Plugin } from "rolldown";
import { BARE_IMPORT_RE } from "../constants";
import { init, parse } from "es-module-lexer";
import resolve from "resolve";
import fs from "fs-extra";
import createDebug from "debug";
import { normalizePath } from "../utils";

const debug = createDebug("dev");

export function preBundlePlugin(deps: Set<string>): Plugin {
  return {
    name: "rolldown:pre-bundle",
    resolveId(source, importer) {
      const isEntry = !importer;
      // 命中需要预编译的依赖
      if (BARE_IMPORT_RE.test(source) && deps.has(source)) {
        // 若为入口，则标记 dep 的 namespace
        return isEntry
          ? {
              id: source,
              external: false,
            }
          : {
              // 因为走到 resolveId 了，所以这里的 path 就是绝对路径了
              id: resolve.sync(source, { basedir: process.cwd() }),
            };
      }
      return null;
    },

    // 拿到标记后的依赖，构造代理模块，交给 rolldown 打包
    async load(id) {
      // 只处理 deps 中的入口
      if (deps.has(id)) {
        await init; // es-module-lexer 词法分析
        const root = process.cwd();
        const entryPath = normalizePath(resolve.sync(id, { basedir: root }));
        const code = await fs.readFile(entryPath, "utf-8");
        const [imports, exports] = await parse(code);
        let proxyModule: string[] = [];
        // cjs
        if (!imports.length && !exports.length) {
          // 构造代理模块
          // 下面的代码后面会解释
          const res = require(entryPath);
          const specifiers = Object.keys(res);
          proxyModule.push(
            `export { ${specifiers.join(",")} } from "${entryPath}"`,
            `export default require("${entryPath}")`
          );
        } else {
          // esm 格式比较好处理，export * 或者 export default 即可
          if (exports.includes("default" as any)) {
            proxyModule.push(`import d from "${entryPath}";export default d`);
          }
          proxyModule.push(`export * from "${entryPath}"`);
        }
        debug("代理模块内容: %o", proxyModule.join("\n"));
        return {
          code: proxyModule.join("\n"),
        };
      }
      return null;
    },
  };
}
