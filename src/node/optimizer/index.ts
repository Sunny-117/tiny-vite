import { rolldown } from "rolldown";
import { green } from "picocolors";
import path from "path";
import { rolldownScanPlugin } from "./rolldownScanPlugin";
import { preBundlePlugin } from "./preBundlePlugin";
import { PRE_BUNDLE_DIR } from "../constants";

export async function optimizeDeps(root: string) {
  // 1. 确定入口(源码中：computeEntries，判断了各种格式，进行了参数归一化)
  // resolveConfig -> loadConfigFromFile
  const entry = path.resolve(root, "src/main.tsx");

  // 2. 从入口处扫描依赖
  const deps = new Set<string>();
  const scanBuild = await rolldown({
    input: [entry],
    plugins: [rolldownScanPlugin(deps)],
  });
  await scanBuild.write({
    dir: path.resolve(root, ".tiny-vite-scan-temp"),
  });
  await scanBuild.close();

  console.log(
    `${green("需要预构建的依赖")}:\n${[...deps]
      .map(green)
      .map((item) => `  ${item}`)
      .join("\n")}\n`
  );

  // 3. 预构建依赖
  // 对应源码：bundleConfigFile: rolldown进行构建
  const bundle = await rolldown({
    input: [...deps],
    plugins: [preBundlePlugin(deps)],
  });
  await bundle.write({
    dir: path.resolve(root, PRE_BUNDLE_DIR),
    format: "esm",
    // rolldown 默认支持 code splitting
  });
  await bundle.close();
}
