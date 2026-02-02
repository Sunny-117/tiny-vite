import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/getEnv.ts'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  console.log({ command, mode, dirname: __dirname, cwd: process.cwd() });
  const root = process.cwd();
  // 默认读取node环境变量
  // mode 表示当前情景 root表示项目根路径，'' 表示前缀，''默认读取所有的环境变量
  const env = loadEnv(mode, root, 'VITE_')
  const viteEnv = wrapperEnv(env);

  return {
    root,
    server: {
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN
    },
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    }
  }
})