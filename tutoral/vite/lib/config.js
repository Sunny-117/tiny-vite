const path = require('path');
const { normalizePath } = require('./server/utils');
const { resolvePlugins } = require('./plugins');
const fs = require('fs-extra');
async function resolveConfig() {
  //当前的根目录 window \\  linux /
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite`))
  let config = {
    root,
    cacheDir
  }
  const jsconfigFile = path.resolve(root, 'vite.config.js')
  const exists = await fs.pathExists(jsconfigFile)
  if (exists) {
    const userConfig = require(jsconfigFile);
    config = { ...config, ...userConfig };
  }
  const userPlugins = config.plugins || [];
  for (const plugin of userPlugins) {
    if (plugin.config) {
      const res = await plugin.config(config)
      if (res) {
        config = { ...config, ...res }
      }
    }
  }
  const plugins = await resolvePlugins(config, userPlugins);
  config.plugins = plugins
  return config;
}
module.exports = resolveConfig;