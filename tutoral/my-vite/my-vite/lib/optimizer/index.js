const { normalizePath } = require('../utils');
const scanImports = require('./scan')
const path = require('path')
const { build } = require('esbuild')
const fs = require('fs-extra')

async function createOptimizeDepsRun(config){
    // 分析依赖，找出项目中依赖了哪些第三方模块
    const deps = await scanImports(config)
    // console.log(deps);

    // 缓存目录
    const { cacheDir } = config
    const depsCacheDir = path.resolve(cacheDir, 'deps')
    const metadataPath = path.join(depsCacheDir, '_metadata.json')

    const metadata = {
        optimized: {}
    }

    for (const id in deps) {
        const entry = deps[id] // 绝对路径
        const file = normalizePath(path.resolve(depsCacheDir, id + '.js'))
        metadata.optimized[id] = {
            "src": entry,
            file,
        }

        await build({
            absWorkingDir: process.cwd(),
            entryPoints: [deps[id]],
            outfile: file,
            bundle: true,
            write: true,
            format: 'esm'
        })
    }

    // 创建缓存目录
    await fs.ensureDir(depsCacheDir) 
    // 写入metadata文件
    await fs.writeFile(metadataPath, JSON.stringify(metadata, (key, value) => {
        if (key === 'file' || key ==='src') {
            return normalizePath(path.relative(depsCacheDir, value))
        }
        return value
    }, 2))

    return {
        metadata
    }
}

exports.createOptimizeDepsRun = createOptimizeDepsRun