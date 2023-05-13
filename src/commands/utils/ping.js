const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Colors } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Check bot's latency"),
	async execute(interaction, client) {
		if (!interaction.deferred) {
			await interaction.deferReply({ fetchReply: true });
		}

		const message = await interaction.fetchReply();

		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.avatarURL(),
			})
			.setTitle("Pong!")
			.setColor(Colors.Green)
			.setTimestamp()
			.setFields(
				{
					name: "API Latency",
					value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
				},
				{
					name: "Client Ping",
					value: `${client.ws.ping}ms`,
				}
			)
			.setFooter({
				text: client.user.username,
				iconURL: client.user.avatarURL(),
			});

		try {
			interaction.editReply({ content: "", embeds: [embed] });
		} catch (error) {
			console.log(`[ERROR]: ${error}`);
			interaction.editReply({ content: `[ERROR]: ${error}`, ephemeral: true });
		}
	},
};
