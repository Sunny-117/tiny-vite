
const scanImports = require('./scan');
const fs = require('fs-extra');
const path = require('path');
const { build } = require('esbuild');
const { normalizePath } = require('../server/utils');
async function createOptimizeDepsRun(config) {
  const deps = await scanImports(config);
  const { cacheDir } = config;
  const depsCacheDir = path.resolve(cacheDir, 'deps')
  const metadataPath = path.join(depsCacheDir, '_metadata.json');
  const metadata = {
    optimized: {}
  }
  for (const id in deps) {
    const entry = deps[id];
    metadata.optimized[id] = {
      file: normalizePath(path.resolve(depsCacheDir, id + '.js')),
      src: entry
    }
    await build({
      absWorkingDir: process.cwd(),
      entryPoints: [entry],
      outfile: path.resolve(depsCacheDir, id + '.js'),
      bundle: true,
      write: true,
      format: 'esm'
    })
  }
  await fs.ensureDir(depsCacheDir);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, (key, value) => {
    // console.log('metadata----->', { depsCacheDir, key, value })
    if (key === 'file' || key === 'src') {
      //optimized里存的是绝对路径，此处写入硬盘的是相对于缓存目录的相对路径
      return normalizePath(path.relative(depsCacheDir, value));
    }
    return value
  }, 2));
  return { metadata };
}
exports.createOptimizeDepsRun = createOptimizeDepsRun;