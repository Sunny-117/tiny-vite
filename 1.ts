export function esbuildDepPlugin() {
  // 定义路径解析的方法
  // 返回 Esbuild 插件
  return {
    name: "vite:dep-pre-bundle",
    setup(build) {
        // bare import 的路径
        build.onResolve(
            { filter: /^[\w@][^:]/ },
            async ({ path: id, importer, kind }) => {
            // 判断是否为入口模块，如果是，则标记上`dep`的 namespace，成为一个虚拟模块
            }
        )
        build.onLoad({ filter: /.*/, namespace: 'dep' }, ({ path: id }) => {
        // 加载虚拟模块
        })
    },
  };
}
