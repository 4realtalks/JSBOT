const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Say the message")
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("A message to send")
				.setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Where to send?")
				.setRequired(false)
		),
	async execute(interaction, _, options) {
		const messageToSend = options.getString("message");
		const channel = options.getChannel("channel") || interaction.channel;

		if (!interaction.deferred) {
			await interaction.deferReply({ fetchReply: true, ephemeral: true });
		}

		await channel.sendTyping();

		try {
			await channel.send({ content: messageToSend });
			await interaction.editReply({
				content: `Message sent to ${channel}!`,
				ephemeral: true,
			});
		} catch (error) {
			console.error(`[ERROR]: ${error}`);
			await interaction.editReply({
				content: `[ERROR]: ${error}`,
				ephemeral: true,
			});
		}
	},
};
