const { build } = require('esbuild')
const path = require('path')
const esBuildScanPlugin = require('./esBuildScanPlugin')

async function scanImports(config) {
    const depImports = {}
    const esPlugin = await esBuildScanPlugin(config, depImports)
    await build({
        absWorkingDir: config.root, // 工作目录时是当前项目的根目录
        entryPoints: [path.resolve('./index.html')], // 打包文件的入口
        bundle: true,
        format: 'esm',
        // outfile: 'dist/index.js', // 实际这里只是在寻找第三方依赖，不需要输出文件，这里是为了直观看到结果
        // write: true, // 实际这里只是在寻找第三方依赖，不需要输出文件，这里是为了直观看到结果
        plugins: [esPlugin],
    })
    return depImports
}

module.exports = scanImports