import { WebSocket } from 'ws';
import 'dotenv/config';
import { setupHeartbeat } from './Heartbeat';
import { EventByCollection, GiftData, db} from '../prisma/db';
import { connect } from './Connect';

export const TONAPI_WS_URL = `wss://tonapi.io/v2/websocket?token=${process.env.TONAPI_KEY}`;
const websocket = new WebSocket(TONAPI_WS_URL);

setupHeartbeat(websocket);

export function SocketSniper (ws: WebSocket){
ws.on('open', () => {
    console.log("CONNECTEND");
    const subscribeAccount = {
        id: 1,
        method: "subscribe_account",
        params: ["EQDc08YxzZWtlKAohSybNc3kXAkAPPtHch-jY_E6KMQ3b1mn"]
    };
    ws.send(JSON.stringify(subscribeAccount)); 
});
    
ws.on('message', async (data) => {
    try {
    const message = JSON.parse(data.toString());
    console.log('СОБЫТИЕ:', JSON.stringify(message, null, 2));

        const CollectionEvent = {
            id: message.params?.events_id || message.params?.event_id || "Неизвестный ID",
            giftTypeId: message.params?.gift_type || "Неизвестный тип подарка",
            buyPrice: message.params?.buy_price || 0,
            buyTxHash: message.params?.tx_hash || "Неизвестный хэш транзакции",
             lt: message.params?.lt || 0,
        };
        await EventByCollection(CollectionEvent as GiftData);
    
    } catch (error) {
      console.error("Ошибка при обработке события:", error);
    }
});

 ws.on('error', (error: Error) => {
    console.log("ERROR", error ? error.message : "Неизвестная ошибка");
  });

ws.on('close', () => {
    console.log("Соеденение закрыто, выполняется попытка переподключения ...");
    setTimeout(() => {
        connect();
    }, 5000);
});
}

connect();

