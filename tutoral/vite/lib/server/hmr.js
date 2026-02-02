const LexerState = {
    inCall: 0,
    inQuoteString: 1,
};

async function handleHMRUpdate(file, server) {
    const { moduleGraph, ws } = server;
    //根据文件获取模块
    const module = moduleGraph.getModuleById(file);
    if (module) {
        const updates = [];
        const boundaries = new Set();
        propagateUpdate(module, boundaries);
        updates.push(
            ...[...boundaries].map(({ boundary, acceptedVia }) => ({
                type: `${boundary.type}-update`,
                path: boundary.url,
                acceptedPath: acceptedVia.url,
            }))
        );
        ws.send({
            type: "update",
            updates,
        });
    }
}

function updateModules(file, modules, { ws }) { }
function propagateUpdate(node, boundaries) {
    if (!node.importers.size) {
        return true;
    }
    for (const importer of node.importers) {
        if (importer.acceptedHmrDeps.has(node)) {
            boundaries.add({
                boundary: importer,
                acceptedVia: node,
            });
            continue;
        }
    }
    return false;
}
function lexAcceptedHmrDeps(code, start, urls) {
    let state = LexerState.inCall;
    let prevState = LexerState.inCall;
    let currentDep = "";
    function addDep(index) {
        urls.add({
            url: currentDep,
            start: index - currentDep.length - 1,
            end: index + 1,
        });
        currentDep = "";
    }
    for (let i = start; i < code.length; i++) {
        const char = code.charAt(i);
        switch (state) {
            case LexerState.inCall:
                if (char === `'` || char === `"`) {
                    prevState = state;
                    state = LexerState.inQuoteString;
                }
                break;
            case LexerState.inQuoteString:
                if (char === `'` || char === `"`) {
                    addDep(i);
                    return false;
                } else {
                    currentDep += char;
                }
                break;
            default:
                break;
        }
    }
    return false;
}
exports.handleHMRUpdate = handleHMRUpdate;
exports.updateModules = updateModules;
exports.lexAcceptedHmrDeps = lexAcceptedHmrDeps;