import DiscordClient from "../clients/discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv'
dotenv.config()

const discord = new DiscordClient(1);
discord.initClient();

const commands = discord.slashCommandsArray;

rest.put(Routes.applicationGuildCommands(discord.clientId, discord.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);