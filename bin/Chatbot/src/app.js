import OsuClient from "./clients/osu.js";
import DiscordClient from "./clients/discord.js";
import TwitchClient from "./clients/twitch.js";
import KarthyBotWebSocketServer from "./webSocket.js";
import dotenv from 'dotenv'
dotenv.config()

export const discord = new DiscordClient(1);
discord.initClient();

export const osu = new OsuClient;
osu.initClient();

export const twitch = new TwitchClient();
twitch.initClient();

export const webSocketServer = new KarthyBotWebSocketServer();

