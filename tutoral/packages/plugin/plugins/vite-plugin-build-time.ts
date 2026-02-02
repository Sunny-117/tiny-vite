import { Plugin,ResolvedConfig } from "vite";

export default function viteBuildTimePlugin(): Plugin { 
  let config: ResolvedConfig | undefined
  let startTime: number;
  let endTime: number;
  return {
    name: "vite-build-time-plugin",
    configResolved(resolvedConfig:ResolvedConfig) { 
      config = resolvedConfig;
    },
    //打包开始，可以使用buildStart钩子
    buildStart() { 
      console.log(`🚀 ~ 欢迎使用系统! 正在为您
      ${config!.command === "build" ? "打包" : "开发编译"}`)

      if (config!.command === "build") { 
        startTime = Date.now();
      }
    },
    closeBundle() {
      if (config!.command === "build") { 
        endTime = Date.now();
        console.log(`👏🏻 ~ 打包完成，耗时${(endTime - startTime)}毫秒`)
      }
    },
  }
}