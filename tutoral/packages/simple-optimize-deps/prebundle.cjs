const esbuild = require('esbuild');

//用户存放扫描到的第三方依赖包的名称
const deps = [];

//扫描插件
function depScanPlugin(deps) {
  return {
    name: 'esbuild-dep-scan',
    setup(build) {
      // 正则表达式，简单判断所有不以.开头的路径都是第三方依赖
      build.onResolve({ filter: /^[^\.]/ }, args => {
        // 将扫描到的第三方依赖包名称存入deps数组中
        deps.push(args.path);
        console.log(deps, 'depsdeps');
      })
    }
  }
}

//进行依赖扫描
(async () => {
  await esbuild.build({
    // 依赖预构建扫描不需要写入文件
    write: false,
    entryPoints: ['src/index.js'],
    //是否需要打包
    bundle: true,
    outdir: './dist',
    loader: {
      '.js': 'jsx',
      '.svg': 'dataurl',
      '.png': 'file'
    },
    plugins: [depScanPlugin(deps)]
  });


  await esbuild.build({
    // 入口文件就是上面扫描的地址
    entryPoints: deps,
    write: true,
    bundle: true,
    format: 'esm',
    outdir: './node_modules/.vite/deps',
  })
})();