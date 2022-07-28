import type WebSocketAlias from 'ws';

import store from "./vue/store";

const karthyBot = new WebSocket(`wss://${import.meta.env.VITE_APP_DOMAIN}:7071/`);

karthyBot.onopen = function(event) {
    
}

karthyBot.onmessage = function(event) {
    const parsedData = JSON.parse(event.data);
    store.commit("setWebSocketData", parsedData);
}

export default karthyBot;