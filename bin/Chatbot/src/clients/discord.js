import { Client, Intents, MessageEmbed, Collection } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { osu } from "../app.js";
import * as path from 'path';
import * as fs from 'fs';

import axios from "axios";

export default class DiscordClient {
    constructor(userid) {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
        this.token = process.env.DISCORD_TOKEN;
        this.clientId = process.env.DISCORD_CLIENT_ID;
        this.guildId = "201465471491506176"; // pull from db
        this.userId = userid;
        this.globalChannels = {
            1: {
                "id": 2,
                "server_id": 1,
                "channel_name": "#mikuia-destroyer"
            }
        }
        this.lastMessage = "";
        this.activeChannels;
        this.requestChannels;
        this.chatChannels;
    }

    initClient() {
        this.client.login(this.token);
        this.setSlashCommands();

        this.client.once("ready", () => {
            console.log("Discord connected!");

            setInterval(() => {this.sendUselessFact('201465471491506176')}, 14400000);

            this.setSlashCommands().then(() => {
                const rest = new REST({ version: '9' }).setToken(this.token);
                rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), { body: this.client.slashCommandsArray })
                    .then((response) => console.log('Commands registered!'))
                    .catch(console.error);
            });

            this.client.on('interactionCreate', async interaction => {
                console.log("interaction happened")
                if (interaction.isCommand()) {
                    this.handleCommand(interaction);
                }
            });
        
            this.client.on("messageCreate", async message => {
                //Bot ignores self
                if (message.author.bot) return;
                this.lastMessage = message;

                if (this.getActiveChannels('chat').includes(`#${message.channel.name}`)) {
                    console.log("message happened");
                    if (message.content.includes("!fok"))
                        this.sendUselessFact(message.channel.id);
                }
                if (this.getActiveChannels('requests').includes(`#${message.channel.name}`)) {
                    if (message.content.includes("osu.ppy.sh/beatmapsets/")) this.requestBeatmap(message, message.channel.id);
                }
            });
        });
    };

    async handleCommand(interaction) {
        if (interaction) {
            const command = this.client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.default.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }

    async initSlashCommand(commandsPath, file) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);

        this.client.slashCommands.set(command.default.data.name, command);
        this.client.slashCommandsArray.push(command.default.data.toJSON());
    }

    async setSlashCommands() {
        this.client.slashCommands = new Collection();
        this.client.slashCommandsArray = [];
        const commandsPath = path.join(process.cwd(), 'bin', 'Chatbot', 'src', 'commands', 'SlashCommands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            await this.initSlashCommand(commandsPath, file);
        }
    }

    getActiveChannels(channelType) {
        let activeChannels = [];
        this.channels = {
            chat: {
                1: {
                    "id": 3,
                    "server_id": 1,
                    "channel_name": "#general"
                },
                2: {
                    "id": 2,
                    "server_id": 1,
                    "channel_name": "#karthy-web"
                }
            },
            requests: {
                1: {
                    "id": 1,
                    "server_id": 1,
                    "channel_name": "#osu-requests"
                },
                2: {
                    "id": 2,
                    "server_id": 1,
                    "channel_name": "#karthy-web"
                }
            }
        };
        for (const [key, value] of Object.entries(this.channels[channelType])) {
            activeChannels.push(value.channel_name);
        }
        return activeChannels;
    };

    async requestBeatmap(message) {
        const messageContent = message.content;
        const urlRegex = /\bhttps?:\/\/\S+/gi;
        const beatmapUrl = messageContent.match(urlRegex)[0];
        const urlSegments = beatmapUrl.split("/");
        const beatmapId = urlSegments.pop() || urlSegments.pop();
        const beatmapEmbed = await osu.getDiscordBeatmapEmbed(beatmapId);
        const embed = new MessageEmbed()
            .setColor(beatmapEmbed.color)
            .setTitle(beatmapEmbed.title)
            .setDescription(beatmapEmbed.description)
            .setThumbnail(beatmapEmbed.thumbnail.url);
        beatmapEmbed.fields.forEach((field) => {
            embed.addField(`${field.name}`, `${field.value}`, field.inline);
        })
            
        message.reply({embeds: [embed]});
        osu.sendRequestToUser(beatmapId, beatmapUrl, message.author.username);
    }

    formatRequestMessage(message) {
        return `${message.author.username} > ${message.content}`;
    }

    sendUselessFact(channelId) {
        axios.get('https://api.api-ninjas.com/v1/facts?limit=1', {
            headers: { 'X-Api-Key': 'mQ+Tie20glAJM8RsdE+Tog==H6KsEzyLDSbPW4p3'},
        })
        .then(response => {
            const channel = this.client.channels.cache.get(`${channelId}`);
            console.log(response);
            channel.send(response.data[0].fact);
        })
        .catch(function (error) {
            console.error(error);
        });
        return;
    }

}