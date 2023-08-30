import { Plugin } from "esbuild";
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from "../constants";

/**
 * 把一些无关的资源进行 external，不让 esbuild 处理，防止 Esbuild 报错，
 * 同时将 bare import 的路径视作第三方包，推入 deps 集合中。
 * @param deps
 * @returns
 */
export function scanPlugin(deps: Set<string>): Plugin {
  return {
    name: "esbuild:scan-deps",
    setup(build) {
      // 忽略的文件类型
      build.onResolve(
        {
          filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`),
        },
        (resolveInfo) => {
          return {
            path: resolveInfo.path,
            // 打上 external 标记
            external: true,
          };
        }
      );
      // 记录依赖
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
          const { path: id } = resolveInfo;
          deps.add(id);
          return {
            path: id,
            external: true,
          };
        }
      );
    },
  };
}
