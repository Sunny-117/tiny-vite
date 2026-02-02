const path = require('path');
const { build } = require('esbuild');
const esbuildDepPlugin = require('./esbuildDepPlugin');
/**
 * 找到我们项目中依赖了哪些第三方模块，然后先预打包到我们的缓存目录中
 * @param {*} config 
 */
async function scanImports(config) {
  const deps = {};//key=原始的模块名 vue value是此模块的es入口模块路径
  const esBuildScan = await esbuildDepPlugin(config, deps);
  await build({
    absWorkingDir: config.root,
    entryPoints: [path.resolve('index.html')],
    outfile: path.resolve('dist/bundle.js'),
    bundle: true,
    write: false,
    format: 'esm',
    plugins: [esBuildScan],
    loader: {
      '.js': 'jsx'
    }
  });
  console.log('deps=>', deps)
  return deps;
}
module.exports = scanImports;