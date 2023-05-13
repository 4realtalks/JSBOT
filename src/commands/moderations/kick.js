const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks member")
		.addUserOption((option) =>
			option.setName("user").setDescription("Who?").setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for the kick?")
				.setRequired(false)
		),
	async execute(interaction, client, options) {
		if (!interaction.deferred) {
			await interaction.deferReply({ fetchReply: true });
		}

		const message = await interaction.fetchReply();

		const target = options.getMember("user");
		const reason = options.getString("reason") ?? "No reason provided";

		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.avatarURL(),
			})
			.setColor(Colors.Red)
			.setDescription(`Kicked ${target.user}`)
			.setFields(
				{ name: "User", value: `${target.user}` },
				{ name: "Reason", value: reason },
				{
					name: "API Latency",
					value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
				},
				{ name: "Client Ping", value: `${client.ws.ping}` }
			)
			.setTimestamp()
			.setFooter({
				text: `${client.user.username}`,
				iconURL: client.user.avatarURL(),
			});

		try {
			if (target !== client.user) {
				await target.kick(reason);
				await interaction.editReply({ content: "", embeds: [embed] });
			}
		} catch (error) {
			console.error(`[ERROR]: ${error}`);
			await interaction.editReply({
				content: `[ERROR]: ${error}`,
				ephemeral: true,
			});
		}
	},
};
