console.log("[vite] connecting...");
var socket = new WebSocket(`ws://${window.location.host}`, "vite-hmr");
socket.addEventListener("message", async ({ data }) => {
    handleMessage(JSON.parse(data));
});
async function handleMessage(payload) {
    switch (payload.type) {
        case "connected":
            console.log(`[vite] connected.`);
            break;
        case "update":
            payload.updates.forEach((update) => {
                if (update.type === "js-update") {
                    fetchUpdate(update);
                }
            });
            break;
        case "full-reload":
            location.reload();
        default:
            break;
    }
}

async function fetchUpdate({ path, acceptedPath }) {
    const mod = window.hotModulesMap.get(path);
    if (!mod) {
        return;
    }
    const moduleMap = new Map();
    const modulesToUpdate = new Set();
    for (const { deps } of mod.callbacks) {
        deps.forEach((dep) => {
            if (acceptedPath === dep) {
                modulesToUpdate.add(dep);
            }
        });
    }
    await Promise.all(
        Array.from(modulesToUpdate).map(async (dep) => {
            const newMod = await import(dep + "?ts=" + Date.now());
            moduleMap.set(dep, newMod);
        })
    );
    for (const { deps, fn } of mod.callbacks) {
        fn(deps.map((dep) => moduleMap.get(dep)));
    }
    const loggedPath = `${acceptedPath} via ${path}`;
    console.log(`[vite] hot updated: ${loggedPath}`);
}