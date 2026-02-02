const path = require('path');
const fs = require('fs-extra');
const htmlTypesRE = /\.html$/;
const scriptModuleRE = /<script src\="(.+?)" type\="module"><\/script>/;
const { createPluginContainer } = require('../server/pluginContainer');
const resolvePlugin = require('../plugins/resolve');

const jsRE = /\.js$/;
async function esBuildScanPlugin(config, deps) {
  config.plugins = [resolvePlugin(config)];
  const container = await createPluginContainer(config);
  const resolve = async (id, importer) => {
    return await container.resolveId(id, importer);
  }
  return {
    name: 'vite:dep-scan',
    setup(build) {
      debugger
      //X [ERROR] No loader is configured for ".vue" files: src/App.vue
      build.onResolve(
        {
          filter: /\.vue$/
        },
        async ({ path: id, importer }) => {
          const resolved = await resolve(id, importer)
          if (resolved) {
            return {
              path: resolved.id,
              external: true
            }
          }
        }
      )
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        debugger
        // console.log('用来处理html路径的', { path, importer })
        const resolved = await resolve(path, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: 'html' //为了更细化区分不同的文件类型，我可以给文件添加一个命名空间
          }
        }
      });
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        debugger
        // console.log('对于其它所有的类型文件我们也进行处理', { path, importer })
        const resolved = await resolve(path, importer);
        if (resolved) {
          const id = resolved.id || resolved;
          // console.log('----->', { id })
          const included = id.includes('node_modules');
          if (included) {
            deps[path] = id;
            // console.log('处理后的deps', deps)
            return {
              path,
              external: true //external设置为true的话说明这是一个外部模块，不会进行后续的打包分析，直接返回了
            }
          }
          return { path: id }
        }
        return { path }
      });
      build.onLoad({ filter: htmlTypesRE, namespace: 'html' }, async ({ path }) => {
        debugger
        // console.log('用来处理读取内容 自定义读取器', path)
        let html = fs.readFileSync(path, 'utf8');
        // console.log(html.match(scriptModuleRE), '匹配结果')
        let [, scriptSrc] = html.match(scriptModuleRE);
        let js = `import ${JSON.stringify(scriptSrc)}`;
        return {
          loader: 'js',
          contents: js // contents: `import "./main.js"`
        }
      })
      build.onLoad({ filter: jsRE }, async ({ path: id }) => {
        debugger
        let ext = path.extname(id).slice(1);// .js  js
        const contents = fs.readFileSync(id, 'utf8');
        // console.log('最终内容读取结果：', contents)
        return {
          loader: ext,
          contents
        }
      })
    }
  }
}

module.exports = esBuildScanPlugin;