const fs = require("fs-extra");
const { parse } = require("url");

async function transformRequest(url, server) {
    const { pluginContainer } = server;
    const { id } = await pluginContainer.resolveId(url); //获取此文件的绝对路径
    const loadResult = await pluginContainer.load(id); //加载此文件的内容
    // console.log(loadResult, '插件的loadResult')
    let code;
    if (loadResult) {
        code = loadResult.code;
    } else {
        let fsPath = parse(id).pathname;
        code = await fs.readFile(fsPath, 'utf-8')
    }
    await server.moduleGraph.ensureEntryFromUrl(url)
    //转换文件内容
    const transformResult = await pluginContainer.transform(code, id);
    return transformResult;
}
module.exports = transformRequest;