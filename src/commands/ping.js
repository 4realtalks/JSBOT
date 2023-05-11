const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Check bot latency"),
	async execute(interaction, options) {
		const startTime = Date.now();
		await interaction.reply("Checking latency...");

		const embed = new EmbedBuilder()
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL(),
			})
			.setTitle("Pong!")
			.setColor(Colors.Green)
			.setFields({ name: "Latency", value: `${Date.now() - startTime}ms` })
			.setTimestamp(Date.now())
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL(),
			});

		try {
			await interaction.editReply({ content: "", embeds: [embed] });
		} catch (error) {
			await interaction.editReply({
				content: `There was an error while trying to execute this command.\nError: \`${error}\``,
			});
			console.error(error);
		}
	},
};
