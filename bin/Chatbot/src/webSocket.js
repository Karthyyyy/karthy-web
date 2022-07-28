import WebSocket, { WebSocketServer } from 'ws';
import { twitch } from './app.js';

export default class KarthyBotWebSocketServer {
    constructor() {
        this.webSocketServer = new WebSocketServer({ port: 7071 });
        this.webSocketClient;
        this.initServer();
        console.log("webSocket initialized!")
    }

    initServer() {
        this.webSocketServer.on('connection', (webSocketClient) => {
            console.log("A web socket client has connected");
            this.webSocketClient = webSocketClient;
            this.webSocketClient.on('message', (data) => {
                const parsedData = JSON.parse(data);
                console.log(parsedData)
                if (parsedData.action === 'replyWords')
                    twitch.sendMessage(parsedData.channel, '@'+parsedData.user+' found '+parsedData.word);
                if (parsedData.action === 'setWords')
                    twitch.usersData.usersModules[parsedData.user].gameWordsEnabled = parsedData.state;
                console.log(twitch.usersData);
            });
        });
    }

    sendMessage(message) {
        this.webSocketClient.send(JSON.stringify(message));
    }
}

/*    clients.set(webSocketClient, metadata);

    webSocketClient.on('message', (messageAsString) => {
        const message = JSON.parse(messageAsString);
      const metadata = clients.get(webSocketClient);

      message = "hello";
      const outbound = JSON.stringify(message);

      [...clients.keys()].forEach((client) => {
        client.send(outbound);
      });
    });
    webSocketClient.on("close", () => {
        clients.delete(webSocketClient);
      });
  });*/