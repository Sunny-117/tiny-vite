import connect from "connect";
import { optimizeDeps } from "../optimizer";
import { blue, green } from "picocolors";
import { transformMiddleware } from "./middlewares/transform";
import { ModuleGraph } from "../ModuleGraph";
import { createPluginContainer, PluginContainer } from "../pluginContainer";
import { resolvePlugins } from "../plugins";
import { indexHtmlMiddware } from "./middlewares/indexHtml";
import { staticMiddleware } from "./middlewares/static";
import { createWebSocketServer } from "../ws";
import chokidar, { FSWatcher } from "chokidar";
import { bindingHMREvents } from "../hmr";
import { Plugin } from "../plugin";
import { normalizePath } from "../utils";
import { htmlFallbackMiddleware } from "./middlewares/htmlFallback";

export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
  moduleGraph: ModuleGraph;
  ws: { send: (data: any) => void; close: () => void };
  watcher: FSWatcher;
}

export async function startDevServer() {
  const app = connect(); // vite1 的时候，内部用的koa，为了和库解耦，为了更加可定制化，用了http内置模块
  const root = process.cwd();
  const startTime = Date.now();
  const plugins = resolvePlugins();
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const pluginContainer = createPluginContainer(plugins);
  const watcher = chokidar.watch(root, {
    ignored: ["**/node_modules/**", "**/.git/**"],
    ignoreInitial: true,
  });
  // WebSocket 对象
  const ws = createWebSocketServer(app);
  // 开发服务器上下文
  const serverContext: ServerContext = {
    root: normalizePath(process.cwd()),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
    ws,
    watcher,
  };
  bindingHMREvents(serverContext);
  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext);
    }
  }

  // 核心编译逻辑
  app.use(transformMiddleware(serverContext));

  // 入口 HTML 资源
  app.use(indexHtmlMiddware(serverContext));

  // 静态资源
  app.use(staticMiddleware(serverContext.root));

  // htmlFallbackMiddleware
  app.use(htmlFallbackMiddleware(serverContext, true))

  app.listen(3000, async () => {
    await optimizeDeps(root);
    console.log(
      green("🚀 No-Bundle 服务已经成功启动!"),
      `耗时: ${Date.now() - startTime}ms`
    );
    console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
  });
}
