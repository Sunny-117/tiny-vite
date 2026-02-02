import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/getEnv.ts'
import vue from '@vitejs/plugin-vue'
import presetEnv from 'postcss-preset-env'
// import path from 'path'

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root, 'VITE_')
  console.log(process.env)
  // mode 表示当前情景 root表示项目根路径，'' 表示前缀，''默认读取所有的环境变量
  console.log({root, __dirname, mode, command, env})

  const viteEnv = wrapperEnv(env);

  return {
    root,
    plugins: [vue()],
    server: {
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN
    },
    esbuild: {
      // https://esbuild.bootcss.com/api/#pure
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    optimizeDeps: {
      exclude: ['lodash-es']
    },
    css: {
      preprocessorOptions: {
        scss: {
          //注意最后要加上分号;
          additionalData: `@import "./src/styles/var.scss";`
        }
      },
      modules: {
        // name 表示当前文件名，local 表示当前类名，hash 表示hash值
        generateScopedName: '[name]_[local]_[hash:base64:5]'
      },
      postcss: {
        plugins: [
          presetEnv({
            browsers: ['last 2 versions', '> 1%', 'IE 11'],
            autoprefixer: { grid: true }
          })
        ]
      }
    }
  }
})