import { Plugin } from "rolldown";
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from "../constants";

// 真正执行依赖预处理的地方
export function rolldownScanPlugin(deps: Set<string>): Plugin {
  return {
    name: "rolldown:scan-deps",
    resolveId(source, importer) {
      // 忽略的文件类型
      const extRegex = new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`);
      if (extRegex.test(source)) {
        return {
          id: source,
          external: true,
        };
      }
      // 记录依赖
      if (BARE_IMPORT_RE.test(source)) {
        deps.add(source);
        return {
          id: source,
          external: true,
        };
      }
      return null;
    },
  };
}
