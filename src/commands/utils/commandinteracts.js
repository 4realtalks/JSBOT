const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("commandinteracts")
		.setDescription("Command interacts")
		.addSubcommand((subcommand) =>
			subcommand.setName("refresh").setDescription("Refresh commands.")
		),
	async execute(interaction, client) {
		try {
			if (!interaction.deferred) {
				await interaction.deferReply({ fetchReply: true });
			}

			const message = await interaction.fetchReply();

			client.handleCommands();

			const embed = new EmbedBuilder()
				.setAuthor({
					name: client.user.username,
					iconURL: client.user.avatarURL(),
				})
				.setColor(Colors.Orange)
				.setDescription("Refreshed commands!")
				.setFields(
					{
						name: "API Latency",
						value: `${
							message.createdTimestamp - interaction.createdTimestamp
						}ms`,
					},
					{ name: "Client Ping", value: `${client.ws.ping}ms` }
				)
				.setTimestamp()
				.setTitle("Refreshed")
				.setFooter({
					text: client.user.username,
					iconURL: client.user.avatarURL(),
				});

			await interaction.editReply({ content: "", embeds: [embed] });
		} catch (error) {
			console.error(`[ERROR]: ${error.stack}`);
			await interaction.editReply({
				content: `[ERROR]: ${error}`,
				ephemeral: true,
			});
		}
	},
};
