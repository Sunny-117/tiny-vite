const { WebSocketServer } = require("ws");

const HMR_HEADER = "vite-hmr";

function createWebSocketServer(httpServer) {
    const wss = new WebSocketServer({ noServer: true });
    httpServer.on("upgrade", (req, socket, head) => {
        if (req.headers["sec-websocket-protocol"] === HMR_HEADER) {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit("connection", ws, req);
            });
        }
    });
    wss.on("connection", (socket) => {
        socket.send(JSON.stringify({ type: "connected" }));
    });
    return {
        on: wss.on.bind(wss),
        off: wss.off.bind(wss),
        send(payload) {
            const stringified = JSON.stringify(payload);
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(stringified);
                }
            });
        },
    };
}
exports.createWebSocketServer = createWebSocketServer;