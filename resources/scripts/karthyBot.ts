import type WebSocketAlias from 'ws';

import store from "./vue/store";

const karthyBot = new WebSocket(`${import.meta.env.VITE_KARTHYBOT_URL}:7071/`);

karthyBot.onopen = function(event) {
    
}

karthyBot.onmessage = function(event) {
    const parsedData = JSON.parse(event.data);
    store.commit("setWebSocketData", parsedData);
}

export default karthyBot;