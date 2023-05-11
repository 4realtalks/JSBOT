const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("commands")
		.setDescription("Commands")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reload")
				.setDescription("Reload commands")
				.addStringOption((stringoption) =>
					stringoption
						.setName("command")
						.setDescription("Command to reload")
						.setRequired(false)
				)
		),
	async execute(interaction, options) {
		let commandName = options.getString("command");
		let replyMessage = "";

		if (!commandName) {
			commandName = "all commands";
			replyMessage = "Reloading all commands...";
		} else {
			commandName = commandName.toLowerCase();
			replyMessage = `Reloading command \`${commandName}\`...`;
		}

		const commands = await interaction.client.guilds.cache
			.get(interaction.guildId)
			.commands.fetch();

		try {
			if (commandName === "all commands") {
				// Reload all commands
				for (const [, cmd] of commands) {
					delete require.cache[require.resolve(`./${cmd.name}.js`)];
					const newCommand = require(`./${cmd.name}.js`);
					await interaction.client.guilds.cache
						.get(interaction.guildId)
						.commands.create(newCommand.data);
				}
			} else {
				// Reload a specific command
				const command = commands.find(
					(cmd) => cmd.name.toLowerCase() === commandName
				);

				if (!command) {
					return interaction.editReply(
						`There is no command with name \`${commandName}\`!`
					);
				}

				delete require.cache[require.resolve(`./${command.name}.js`)];

				const newCommand = require(`./${command.name}.js`);
				await interaction.client.guilds.cache
					.get(interaction.guildId)
					.commands.create(newCommand.data);

				replyMessage = `Successfully reloaded \`${newCommand.data.name}\``;

				await interaction.editReply(replyMessage);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply(
				`There was an error while reloading the command(s):\n\`${error.message}\``
			);
		}
	},
};
