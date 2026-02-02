import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig((): UserConfig => {
  const root = process.cwd();
  return {
    root,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    build: {
      assetsInlineLimit: 10240,
    },
    // TODO
    // https://www.51cto.com/article/668004.html
    // assetsInclude:['**/*.md']
  }
})