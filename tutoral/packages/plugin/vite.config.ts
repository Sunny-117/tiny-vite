import { defineConfig, ConfigEnv, UserConfig, loadEnv } from "vite";
import { wrapperEnv } from "./build/getEnv.ts";
import vue from "@vitejs/plugin-vue";
import presetEnv from "postcss-preset-env";
// import testPlugin from "./plugins/vite-plugin-test.ts"
import viteBuildTimePlugin from "./plugins/vite-plugin-build-time.ts"
import viteHTMLTitlePlugin from "./plugins/vite-plugin-html-title.ts"
import vitePluginVirtualModule from "./plugins/vite-plugin-virtual-module.ts"
import path from "path";

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root, "VITE_");
  const viteEnv = wrapperEnv(env);

  return {
    root,
    plugins: [
      vue(),
      viteBuildTimePlugin(),
      viteHTMLTitlePlugin({ title: '这是我第一次的HTML' }),
      vitePluginVirtualModule()
    ],
    server: {
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
    },
    // esbuild: {
    //   pure:viteEnv.VITE_DROP_CONSOLE ? ['console.log','debugger'] : []
    // },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["lodash-es"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          //注意最后要加上分号;
          additionalData: `@import "./src/styles/var.scss";`,
        },
      },
      modules: {
        // name 表示当前文件名，local 表示当前类名，hash 表示hash值
        generateScopedName: "[name]_[local]_[hash:base64:5]",
      },
      postcss: {
        plugins: [
          presetEnv({
            browsers: ["last 2 versions", "> 1%", "IE 11"],
            autoprefixer: { grid: true },
          }),
        ],
      },
    },
    build: {
      assetsInlineLimit: 10240,
    },
    // assetsInclude:['**/*.md']
  };
});
