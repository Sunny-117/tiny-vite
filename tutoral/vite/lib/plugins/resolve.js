
const fs = require('fs');
const path = require('path');
const { config } = require('process');
const resolve = require('resolve');

function resolvePlugin({ root }) {
  return {
    name: 'vite:resolve',
    resolveId(id, importer) {// 根据你引入名字解析一个硬盘上的路径
      // console.log('resolvePlugin:------>', {id, importer, isAbs: path.isAbsolute(id)})
      const htmlTypesRE = /\.html$/;
      if (htmlTypesRE.test(id)) {
        return { id }
      }
      // ? 不明白/和isAbsolute有啥区别
      // /
      if (id.startsWith('/')) {// 针对：/main.js 
        return { id: path.resolve(root, id.slice(1)) }
      }
      //绝对路径
      if (path.isAbsolute(id)) {
        return { id }
      }
      //相对路径
      if (id.startsWith('.')) { // ./app.js
        const baseDir = path.dirname(importer); // 引入方的目录
        const fsPath = path.resolve(baseDir, id);
        return { id: fsPath }
      }
      // node_modules 第三方模块
      const res = tryNodeResolve(id, importer, { root });
      if (res) return res;
    }
  }
}
function tryNodeResolve(id, importer, { root }) {
  const pkgPath = resolve.sync(`${id}/package.json`, { basedir: config.root });
  const pkgDir = path.dirname(pkgPath)
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const entryPoint = pkg.module;
  debugger
  const entryPointPath = path.join(pkgDir, entryPoint);
  //就是vue es module编译 的入口中
  return { id: entryPointPath }
}

module.exports = resolvePlugin;