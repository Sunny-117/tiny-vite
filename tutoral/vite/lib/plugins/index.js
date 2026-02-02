const importAnalysisPlugin = require("./importAnalysis");
const preAliasPlugin = require("./preAlias");
const resolvePlugin = require("./resolve");
const definePlugin = require('./define')

async function resolvePlugins(config, userPlugins) {
    return [
        preAliasPlugin(config), //把vue=>vue.js
        resolvePlugin(config),
        ...userPlugins,
        definePlugin(config),
        importAnalysisPlugin(config),
    ];
}
exports.resolvePlugins = resolvePlugins;