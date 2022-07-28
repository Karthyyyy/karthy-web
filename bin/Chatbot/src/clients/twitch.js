import tmi from 'tmi.js';
import { webSocketServer } from "../app.js";
import { osu } from "../app.js";
import axios from 'axios';

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
        channels: []
      });
      this.lastMessage = "";
    }

    initClient() {
      this.setUsersData();
        this.client.connect();
        this.handleMessages();
    }

    setUsersData() {
      const usersData = {
        usersModules: {

        }
      }
      axios.get(process.env.APP_URL+'/api/get_integrations_twitch').then((response) => {
        if (response.data.success) {
          response.data.data.forEach((value) => {
            usersData.usersModules[value.twitch_login] = {
              osuRequests: true,
              gameWordsEnabled: false
            }
          })
        }
        this.client.channels = Object.keys(usersData.usersModules);
        this.usersData = usersData;
      }).catch((error) => {
        console.log(error);
      })
      this.usersData = usersData;
    }

    handleMessages() {
      this.client.on('message', (channel, tags, message, self) => {
        const channelUser = channel.replace('#', '');
        // Ignore echoed messages.
        if (self) return;

        if ((webSocketServer.webSocketClient) && (this.usersData.usersModules[channelUser].gameWordsEnabled)) {
          let messageToSend = {user: tags, message: message, channel: channel, platform: 'twitch'};
          webSocketServer.sendMessage(messageToSend);
        }

        if ((this.usersData.usersModules[channelUser].osuRequests) && (message.includes("osu.ppy.sh/beatmapsets/"))) {
          this.requestBeatmap(message, channel, tags);
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