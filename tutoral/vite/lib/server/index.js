
const connect = require('connect');
const http = require('http');
const serveStaticMiddleware = require('./middlewares/static');
const resolveConfig = require('../config');
const { createOptimizeDepsRun } = require('../optimizer');
const transformMiddleware = require('./middlewares/transform');
const { createPluginContainer } = require('./pluginContainer');
// * hmr
const { handleHMRUpdate } = require('./hmr');
const { createWebSocketServer } = require('./ws');
const chokidar = require('chokidar');
const { ModuleGraph } = require('./moduleGraph')
const { normalizePath } = require('./utils');
const path = require('path');

async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const httpServer = require('http').createServer(middlewares)
  const ws = createWebSocketServer(httpServer, config)
  const watcher = chokidar.watch(path.resolve(config.root), {
    ignored: [
      '**/node_modules/**',
      '**/.git/**'
    ]
  });
  const moduleGraph = new ModuleGraph((url) =>
    pluginContainer.resolveId(url)
  )

  const pluginContainer = await createPluginContainer(config)
  const server = {
    config,
    ws,
    watcher,
    moduleGraph,
    httpServer,
    pluginContainer,
    async listen(port) {
      debugger
      await runOptimize(config, server)
      httpServer.listen(port, async () => {
        console.log(`server running at http://localhost:${port}`);
      });
    }
  }
  watcher.on('change', async (file) => {
    file = normalizePath(file)
    await handleHMRUpdate(file, server)
  })
  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(server)
    }
  }
  middlewares.use(transformMiddleware(server))
  middlewares.use(serveStaticMiddleware(config));
  return server;
}
async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);
  server._optimizeDepsMetadata = optimizeDeps.metadata
  console.log({ server })
}
exports.createServer = createServer;