import WebSocket, { WebSocketServer } from 'ws';
import { twitch } from './app.js';
import https from 'https';
import fs from 'fs';

export default class KarthyBotWebSocketServer {
    constructor() {
        let server;
        if (process.env.APP_URL.includes('https')) {
            server = https.createServer({
                cert: fs.readFileSync('/etc/letsencrypt/live/karthy.tv/fullchain.pem'),
                key: fs.readFileSync('/etc/letsencrypt/live/karthy.tv/privkey.pem')
            });
            this.webSocketServer = new WebSocket.Server({ server });
            server.listen(7071);
        } else {
            this.webSocketServer = new WebSocket.Server({ port: 7071 });
        }
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