import WebSocket from 'ws';

let pingInterval: NodeJS.Timeout;
let heartbeatTimeout: NodeJS.Timeout;

export function setupHeartbeat(ws: WebSocket) {
const heartbeat = () => {
clearTimeout(pingInterval);
heartbeatTimeout = setTimeout(() => {
    console.log("Сервер лег или проблеммы с вифи (");
    ws.terminate();
}, 10000); // 10 seconds timeout
}
let counter = 1;

ws.on('pong', () => {
    clearTimeout(heartbeatTimeout);
    console.log("С сервером все оки X" + counter++);
});

pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        heartbeat();
        ws.ping();
    }
}, 30000);
}