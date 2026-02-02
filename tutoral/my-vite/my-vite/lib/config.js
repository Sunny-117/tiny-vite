const { resolvePlugins } = require('./plugins')
const { normalizePath } = require('./utils')
const path = require('path')
const fs = require('fs-extra')

async function resolveConfig() {
    const root = normalizePath(process.cwd())
    // 缓存目录，存放预编译后的文件和metadata.json
    const cacheDir = normalizePath(path.resolve(`node_modules/.my-vite`))
    let config = { 
        root,
        cacheDir,
    }
    const configFile = path.resolve(root, 'vite.config.js')
    const exist = await fs.pathExists(configFile)
    if (exist) {
        const userConfig = require(configFile)
        config = {
            ...config,
            ...userConfig
        }
    }
    const userPlugins = config.plugins
    for (const plugin of userPlugins) {
        if (plugin.config) {
            const res = await plugin.config(config)
            if (res) {
                config = {
                    ...config, ...res
                }
            }
        } 
    }
    const plugins = await resolvePlugins(config, userPlugins)
    config.plugins = plugins
    return config
}

module.exports = resolveConfig