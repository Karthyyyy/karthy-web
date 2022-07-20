import { SlashCommandBuilder } from '@discordjs/builders';
import { Permissions, GuildMember } from 'discord.js';
import axios from 'axios';

const command = {
	data: new SlashCommandBuilder()
		.setName('watch-channel')
		.setDescription('Bot will include this channel in the list of channels it listens to'),
	async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
			await interaction.reply('Trying to watch #'+interaction.channel.name+'...');
			let reply = '';
			await axios.post(process.env.APP_URL+'/api/discord/channel/create', {
				userId: 1,
				serverId: interaction.guildId,
				discordChannelId: interaction.channelId,
				description: interaction.channel.name
			}).then(response => {
				if (response.data.success) {
					reply = 'Now watching channel';
					interaction.editReply(reply);
				} else {
					reply = 'This channel is already being watched (probably)';
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