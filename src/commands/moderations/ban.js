const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Bans member")
		.addUserOption((option) =>
			option.setName("user").setDescription("Who?").setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for the ban?")
				.setRequired(false)
		),
	async execute(interaction, client) {
		const options = interaction.options;

		if (!interaction.deferred) {
			await interaction.deferReply({ fetchReply: true });
		}

		const message = await interaction.fetchReply();

		const target = options.getUser("user");
		const reason = options.getString("reason") ?? "No reason provided";

		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.avatarURL(),
			})
			.setColor(Colors.Red)
			.setDescription(`Banned ${target.username}`)
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
				await interaction.guild.members.ban(target, { reason });
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
