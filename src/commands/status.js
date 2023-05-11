const { EmbedBuilder, Colors, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Current user's status")
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("user")
				.setDescription("Current user's status")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("get")
						.setDescription("Get current user's status")
						.addUserOption((option) =>
							option
								.setName("user")
								.setDescription("User to get current status")
						)
				)
		),
	async execute(interaction, options) {
		const targetUser = options.getUser("user") || interaction.user;
		const userPresence = targetUser.presence;

		let status = "Offline";

		if (userPresence && userPresence.status) {
			status = userPresence.status;
		}

		const embed = new EmbedBuilder()
			.setDescription(`Got the current status for ${targetUser}!`)
			.setFields(
				{ name: "Status", value: status, inline: true },
				{ name: "User", value: targetUser.username, inline: true }
			)
			.setColor(Colors.Green)
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL(),
			})
			.setTimestamp()
			.setFooter({
				text: interaction.client.user.username,
				iconURL: interaction.client.user.displayAvatarURL(),
			})
			.setTitle("Got user's current status!");

		try {
			await interaction.reply({ embeds: [embed] });
		} catch (error) {
			await interaction.editReply({
				content: `There was an error while trying to execute this command.\nError: \`${error}\``,
			});
			console.error(error);
		}
	},
};
