import { defineConfig, ConfigEnv, UserConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/getEnv.ts'
import react from '@vitejs/plugin-react'
import presetEnv from 'postcss-preset-env'
import tailwindcss from 'tailwindcss'

export default defineConfig(({mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root, 'VITE_')

  const viteEnv = wrapperEnv(env);

  return {
    root,
    plugins: [react({
      babel: {
        plugins: [
          "babel-plugin-styled-components"
        ]
      }
    })],
    server: {
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN
    },
    css: {
      postcss: {
        plugins: [
          // 也可以是autoprefixer
          // autoprefixer()
          presetEnv({
            browsers: "last 2 versions"
          }),
          tailwindcss()
        ]
      }
    }
  }
})