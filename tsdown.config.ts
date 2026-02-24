// tsdown.config.ts
import { defineConfig } from "tsdown";

export default defineConfig({
  // 后续会增加 entry
  entry: {
    index: "src/node/cli.ts",
    client: "src/client/client.ts",
  },
  // rolldown 只支持esm
  format: ["esm"],
  // 目标语法
  target: "es2020",
  // 生成 sourcemap
  sourcemap: true,
  shims: true
  // 没有拆包的需求，关闭拆包能力
  // splitting: false,
});
