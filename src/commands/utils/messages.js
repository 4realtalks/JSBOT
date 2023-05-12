const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("messages")
		.setDescription("Messages")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("clear")
				.setDescription("Clear the messages in the channel")
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("Which channel?")
						.setRequired(true)
				)
		),
	async execute(interaction, client, options) {
		try {
			const channel = options.getChannel("channel");

			if (!channel) {
				throw new Error("Channel not found.");
			}

			const message = await interaction.deferReply({
				fetchReply: true,
			});

			const startTime = Date.now();
			let messagesDeleted = 0;

			let fetchedMessages;
			do {
				fetchedMessages = await channel.messages.fetch({ limit: 100 });
				const deletionPromises = fetchedMessages.map(async (fetchedMessage) => {
					if (fetchedMessage.id !== message.id && fetchedMessage.deletable) {
						await fetchedMessage.delete();
						messagesDeleted++;
					}
				});

				await Promise.all(deletionPromises);
			} while (fetchedMessages.size === 100);

			const endTime = Date.now();
			const deletionTime = Math.round(endTime - startTime) / 1000;

			const embed = new EmbedBuilder()
				.setAuthor({
					name: client.user.username,
					iconURL: client.user.avatarURL(),
				})
				.setTitle("Messages Cleared!")
				.setColor(Colors.Green)
				.setDescription(
					`Messages in <#${channel.id}> have been cleared successfully!`
				)
				.setTimestamp()
				.setFooter({
					text: client.user.username,
					iconURL: client.user.avatarURL(),
				})
				.setFields(
					{ name: "Deletion Time", value: `${deletionTime}s` },
					{ name: "Deleted Messages", value: messagesDeleted.toString() },
					{
						name: "API Latency",
						value: `${
							message.createdTimestamp - interaction.createdTimestamp
						}ms`,
					},
					{ name: "Client Ping", value: `${client.ws.ping}ms` }
				);

			await interaction.editReply({ content: "", embeds: [embed] });
		} catch (error) {
			console.error(`[ERROR]: ${error}`);
			await interaction.editReply({
				content: `[ERROR]: ${error}`,
				ephemeral: true,
			});
		}
	},
};
