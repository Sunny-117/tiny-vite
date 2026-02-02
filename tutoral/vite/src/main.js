import { render } from "./render.js";
render();
window.hotModulesMap = new Map();
var ownerPath = "/src/main.js";
import.meta.hot = {
    accept(deps, callback) {
        acceptDeps(deps, callback);
    },
};
function acceptDeps(deps, callback) {
    const mod = hotModulesMap.get(ownerPath) || {
        id: ownerPath,
        callbacks: [],
    };
    mod.callbacks.push({
        deps,
        fn: callback,
    });
    hotModulesMap.set(ownerPath, mod);
}
if (import.meta.hot) {
    import.meta.hot.accept(["./render.js"], ([renderMod]) => {
        renderMod.render();
    });
}
