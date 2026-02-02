import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import ElementPlus from 'unplugin-element-plus/vite'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus({ format: 'esm' }),
    chunkSplitPlugin({
      customSplitting: {
        'vue-vender': ['vue', 'vue-router'],
        'element-plus': ['element-plus'],
        'lodash-es': ['lodash-es'],
        'components-util':[/src\/components/]
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    }
  },
  build: {
    minify: true,
    //可以配置是否关闭css code split
    // cssCodeSplit: false,

    // 自动注入一个模块与加载器的polyfill
    modulePreload: {
      polyfill:true
    },

    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        // manualChunks: {
        //   'vender': ['vue', 'vue-router'],
        //   'element-plus': ['element-plus'],
        //   'lodash-es': ['lodash-es'],
        // }
        // 函数式配置，但是简单配置分割可能会引起模块循环引用的问题
        // manualChunks(id) { 
        //   if(id.includes('node_modules/vue')) {
        //     return 'vue-vender'
        //   }
        //   if(id.includes('element-plus')) {
        //     return 'element-plus'
        //   }
        //   if(id.includes('lodash-es')) {
        //     return 'lodash-es'
        //   }
        // }
      }
    }
  }
})
