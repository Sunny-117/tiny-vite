const { normalizePath } = require('../server/utils');

async function createPluginContainer({ plugins }) {
  class PluginContext {
    async resolve(id, importer = path.join(root, 'index.html')) {
      return await container.resolveId(id, importer)
    }
  }
  //插件容器是一个用来执行插件的容器
  const container = {
    //resolve是一个方法，是一个根据标记符计算路径的方法
    //vue=>vue在硬盘上对应路径 
    async resolveId(id, importer) {
      let ctx = new PluginContext();
      let resolveId = id;
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue;
        const result = await plugin.resolveId.call(ctx, id, importer);
        if (result) {
          resolveId = result.id || result
          break
        }
      }
      return { id: normalizePath(resolveId) }
    },
    async load(id) {
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.load) continue;
        const result = await plugin.load.call(ctx, id)
        if (result !== null) {
          return result
        }
      }
      return null
    },
    async transform(code, id) {
      const ctx = new PluginContext();
      for (const plugin of plugins) {
        if (!plugin.transform) continue;
        const result = await plugin.transform.call(ctx, code, id)
        if (!result) continue
        code = result.code || result
      }
      return { code }
    }
  }
  return container;
}
exports.createPluginContainer = createPluginContainer;