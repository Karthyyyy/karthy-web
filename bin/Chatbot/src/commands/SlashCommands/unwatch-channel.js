import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, GuildMember } from 'discord.js';
import axios from 'axios';

const command = {
	data: new SlashCommandBuilder()
		.setName('unwatch-channel')
		.setDescription('Bot will no longer include this channel in the list of channels it listens to'),
	async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			await interaction.reply('Trying to unwatch #'+interaction.channel.name+'...');
			let reply = '';
			await axios.post(process.env.APP_URL+'/api/discord/channel/delete', {
                serverId: interaction.guildId,
				discordChannelId: interaction.channelId
			}).then(response => {
				if (response.data.success) {
					reply = 'I will no longer watch this channel';
					interaction.editReply(reply);
				} else {
					reply = 'There was an issue unwatching this channel';
					interaction.editReply(reply);
				}
			}).catch(function (error) {
				console.log(error);
				reply = 'There was an error trying to watch this channel';
				interaction.editReply(reply);
			});
        } else {
            await interaction.reply('You need to be an administrator to do this');
        }
	},
};

export default command;