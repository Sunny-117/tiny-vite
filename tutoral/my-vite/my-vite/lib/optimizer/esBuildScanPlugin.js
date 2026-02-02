const fs = require('fs')
const path = require('path')
const { createPluginContainer } = require('../server/pluginContainer') // 运行vite插件的容器
const resolvePlugin = require('../plugins/resolve');
const { normalizePath } = require('../utils');

// 实际项目案例：index.html中有<script type="module" src="/src/main.js"></script>，main.js中使用vue，其流程如下：
// 1.入口文件是index.html，先走onResolve({ filter: htmlTypesRE, }，为其定义namespace
// 2.然后走onLoad({ filter: htmlTypesRE, namespace: 'html' }，读取index.html的内容，并将其替换成js文件返回，内容是：import "/src/main.js"
// 3.由于是js文件，又走到onResolve({ filter: /.*/ }，这里返回了main.js的系统路径
// 4.然后走到onLoad({ filter: JS_TYPES_RE }，读取main.js的内容
// 5.由于mian.js中引入了vue，因此走到了onResolve({ filter: /.*/ }，拿到了vue对应的全路径(node_modules中的vue)，判断这是一个第三方模块，标记external为true，其他的交给esbuild处理，流程结束，此时已经找出了第三方模块对应的文件。

const htmlTypesRE = /\.html$/;
const scriptModuleRE = /<script type="module" src\="(.+?)"><\/script>/
const JS_TYPES_RE = /\.js$/

async function esBuildScanPlugin(config, depImports) {
    config.plugins = [resolvePlugin(config)]
    const container = await createPluginContainer(config)
    const resolve = async (importee, importer = path.join(root, 'index.html')) => {
        return await container.resolveId(importee, importer)
    }
    return {
        name: 'vite:dep-scan',
        setup(build) {
            // 解析路径
            build.onResolve({ filter: /\.vue$/, }, async ({ path, importer }) => {
                const resolved = await resolve(path, importer)
                if (resolved) {
                    return {
                        path: resolved.id || resolved,
                        external: true // 把vue文件标识为外部文件
                    }
                }
            });
            build.onResolve({ filter: htmlTypesRE, }, async ({ path, importer }) => {
                const resolved = await resolve(path, importer)
                if (resolved) {
                    return {
                        path: resolved.id || resolved,
                        namespace: 'html' // 把html文件放入到一个自定义命名空间
                    }
                }
            });
            build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
                const resolved = await resolve(path, importer)
                if (resolved) {
                    const id = resolved.id || resolved
                    const included = id.includes('node_modules')
                    if (included) {
                        depImports[path] = normalizePath(id)
                        return {
                            path: id,
                            external: true // 表示这是一个外部模块，不需要进一步处理
                        }
                    }
                    return { path: id }
                }
            })
            // 读取文件内容
            build.onLoad({ filter: htmlTypesRE, namespace: 'html' }, async ({ path }) => {
                const html = fs.readFileSync(path, 'utf-8')
                const [, scriptSrc] = html.match(scriptModuleRE)
                const js = `import ${JSON.stringify(scriptSrc)}` // import "/scr/main.js"
                // 相当于这个index.html的内容等同于import "/src/main.js"，文件类型是js
                return {
                    contents: js,
                    loader: 'js'
                }
            })
            build.onLoad({ filter: JS_TYPES_RE }, async ({ path: id }) => {
                let ext = path.extname(id).slice(1)
                let contents = fs.readFileSync(id, 'utf-8')
                return {
                    contents,
                    loader: ext
                }
            })
        }
    }
}

module.exports = esBuildScanPlugin