import { build } from "esbuild";
import { green } from "picocolors";
import path from "path";
import { esbuildScanPlugin } from "./esbuildScanPlugin";
import { preBundlePlugin } from "./preBundlePlugin";
import { PRE_BUNDLE_DIR } from "../constants";

export async function optimizeDeps(root: string) {
  // 1. 确定入口(源码中：computeEntries，判断了各种格式，进行了参数归一化)
  // resolveConfig -> loadConfigFromFile
  const entry = path.resolve(root, "src/main.tsx");

  // 2. 从入口处扫描依赖
  const deps = new Set<string>();
  await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    plugins: [esbuildScanPlugin(deps)],
  });
  console.log(
    `${green("需要预构建的依赖")}:\n${[...deps]
      .map(green)
      .map((item) => `  ${item}`)
      .join("\n")}\n`
  );

  // 3. 预构建依赖
  // 对应源码：bundleConfigFile: esbuild进行构建
  await build({
    entryPoints: [...deps],
    write: true,
    bundle: true,
    format: "esm",
    splitting: true,
    outdir: path.resolve(root, PRE_BUNDLE_DIR),
    plugins: [preBundlePlugin(deps)],
  });
}
