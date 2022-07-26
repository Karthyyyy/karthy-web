import tmi from 'tmi.js';
import { webSocketServer } from "../app.js";
import { osu } from "../app.js";

export default class TwitchClient {
    constructor() {
        this.client = new tmi.Client({
            connection: {
              secure: true,
              reconnect: true
            },
            identity: {
                username: 'karthy',
                password: process.env.TWITCH_OAUTH_TOKEN
            },
            channels: [ 'karthy' ]
          });
        this.lastMessage = "";
    }

    initClient() {
        this.client.connect();
        console.log("Twitch connected!");

        this.client.on('message', (channel, tags, message, self) => {
            // Ignore echoed messages.
            if(self) return;

            if (webSocketServer.webSocketClient) {
              let messageToSend = {user: tags, message: message, channel: channel, platform: 'twitch'};
              webSocketServer.sendMessage(messageToSend)
            }
            
            if (channel === '#karthy') {
              if (message.includes("osu.ppy.sh/beatmapsets/")) this.requestBeatmap(message, channel, tags);
            }
        });
    }

    sendMessage(channel, message) {
      this.client.say(channel, this.buildMessage(message));
    }

    buildMessage(message) {
        return `${message} karthyBot`;
    }

    async requestBeatmap(message, channel, tags) {
      const messageContent = message;
      const urlRegex = /\bhttps?:\/\/\S+/gi;
      const beatmapUrl = messageContent.match(urlRegex)[0];
      const urlSegments = beatmapUrl.split("/");
      const beatmapId = urlSegments.pop() || urlSegments.pop();
      const beatmapEmbed = await osu.getDiscordBeatmapEmbed(beatmapId).catch(response => {console.log(response);});
      this.client.say(channel, this.buildMessage(`@${tags.username} requested ${beatmapEmbed.title}`));
      osu.sendRequestToUser(beatmapId, beatmapUrl, tags.username);
      
  }
}