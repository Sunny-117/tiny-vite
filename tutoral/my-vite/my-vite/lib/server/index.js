const connect = require('connect')
const { log } = require('console')
const serverStaticMiddleware = require('./middlewares/static')
const resolveConfig = require('../config')
const { createOptimizeDepsRun } = require('../optimizer')
const transformMiddleware = require('./middlewares/transform')
const { createPluginContainer } = require('./pluginContainer')

async function createServer() {
    const config = await resolveConfig()
    const middlewares = connect()
    const pluginContainer = await createPluginContainer(config)
    const server = {
        pluginContainer,
        async linsten(port) {
            await runOptimize(config, server)
            require('http').createServer(middlewares).listen(port, () => {
                log(`dev server running at: http://localhost:${port}`)
            })
        }
    }
    for (const plugin of config.plugins) {
        if (plugin.configureServer) {
            plugin.configureServer(server)
        }
    }
    middlewares.use(transformMiddleware(server))
    middlewares.use(serverStaticMiddleware(config))
    return server;
}

async function runOptimize(config, server) {
    const optimizeDeps = await createOptimizeDepsRun(config)
    server._optimizeDepsMetadata = optimizeDeps.metadata;
    // console.log(server._optimizeDepsMetadata)
}

exports.createServer = createServer;