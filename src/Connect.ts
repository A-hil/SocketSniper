import {WebSocket} from "ws";
import 'dotenv/config';
import {setupHeartbeat} from "./Heartbeat";
import {TONAPI_WS_URL} from "./index";
import {SocketSniper} from "./index";

export const connect = () => {
    const websocket = new WebSocket(TONAPI_WS_URL);

    SocketSniper(websocket);
    setupHeartbeat(websocket);
}