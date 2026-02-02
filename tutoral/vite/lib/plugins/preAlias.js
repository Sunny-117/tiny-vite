function preAliasPlugin() {
    let server;
    return {
        name: "vite:pre-alias",
        configureServer(_server) {
            server = _server;
        },
        resolveId(id) {
            //把vue=>vue.js
            const metadata = server._optimizeDepsMetadata;
            const isOptimized = metadata.optimized[id];
            if (isOptimized) {
                return {
                    id: isOptimized.file, // vue => c:/node_modules/.vite/deps/vue.js
                };
            }
        },
    };
}
module.exports = preAliasPlugin;