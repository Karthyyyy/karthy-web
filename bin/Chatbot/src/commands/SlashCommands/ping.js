import { SlashCommandBuilder } from '@discordjs/builders';

const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        console.log(interaction);
		await interaction.reply('Pong!!');
	},
};

export default command;