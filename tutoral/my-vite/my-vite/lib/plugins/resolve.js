const fs = require('fs')
const path = require('path')
const resolve = require('resolve')

function resolvePlugin(config) {
    return {
        name: 'vite:resolve',
        resolveId(importee, importer) {
            // 说明这是相对于项目跟目录的绝对路径
            if (importee.startsWith('/') && !importee.startsWith('/Users')) {
                return { 
                    id: path.resolve(config.root, importee.slice(1)) // 拼接成绝对路径
                }
            }
            // 如果已经是硬盘上的绝对路径，则直接返回
            if (path.isAbsolute(importee)) {
                return {
                    id: importee
                }
            }
            // 相对路径
            if (importee.startsWith('.')){
                const baseDir = path.dirname(importer)
                const fsPath = path.resolve(baseDir, importee)
                return { id: fsPath }
            }
            // 第三方模块
            let res = tryNodeResolve(importee, importer, config);
            if (res) return res
        }
    }
}

function tryNodeResolve(importee, importer, config) {
    const pkgPath = resolve.sync(`${importee}/package.json`, { basedir: config.root })
    const pkgDir = path.dirname(pkgPath)
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const entryPoint = pkg.module; // 包描述文件中的module属性指向此模块的es6版本代码
    const entryPointPath = path.join(pkgDir, entryPoint)
    return {
        id: entryPointPath
    }
}

module.exports = resolvePlugin