import { ConfigEnv, UserConfig, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import ElementPlus from 'unplugin-element-plus/vite'
import { wrapperEnv } from './src/build/getEnv'
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from "rollup-plugin-external-globals";
import { compression } from 'vite-plugin-compression2'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);

  return {
    plugins: [
      vue(),
      ElementPlus({ format: 'esm' }),
      visualizer({
        // open: true,
      }),
      compression({
        //压缩算法，默认gzip
        algorithm: 'brotliCompress',
        //匹配文件
        include: [/\.(js)$/, /\.(css)$/,],
        //压缩超过此大小的文件,以字节为单位
        // threshold: 10240,
        //是否删除源文件，只保留压缩文件
        // deleteOriginalAssets: true
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // 注意，别名处理这里只能是ESM模块，CJS模块无法处理
        "lodash-es": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm"
      }
    },
    build: {
      // minify: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: viteEnv.VITE_DROP_CONSOLE,
          drop_debugger: viteEnv.VITE_DROP_CONSOLE,
        },
      },

      // 自动注入一个 模块预加载 polyfill
      modulePreload: {
        polyfill: true
      },

      // 可以这个配置关闭 css code split
      // cssCodeSplit: false,

      // 规定触发警告的chunk大小
      // chunkSizeWarningLimit: 2000,

      // 禁用gzip压缩大小报告,可以略微减少打包时间
      // reportCompressedSize: false,
      rollupOptions: {
        external: ['vue', 'vue-router', 'element-plus', 'vue-echarts', 'echarts', '@vueuse/core'],
        plugins: [
          externalGlobals({
            "vue": "Vue",
            "vue-router": "VueRouter",
            "element-plus": 'ElementPlus',
            "@vueuse/core": "VueUse",
            "echarts": "echarts",
            "vue-echarts": "VueECharts",
          })
        ],
        output: {
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

          // manualChunks: {
          //   'vue-vendor': ['vue', 'vue-router','@vueuse/core'],
          //   'element-plus': ['element-plus'],
          //   'lodash-es': ['lodash-es'],
          //   'echarts': ['echarts','vue-echarts']
          // },
        }
      }
    }
  }
})
