module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			const { commands } = client;
			const { commandName, options } = interaction;
			const command = commands.get(commandName);
			if (!command) return;

			try {
				await command.execute(interaction, client, options);
			} catch (error) {
				console.log(`[ERROR]: ${error}`);
				await interaction.editReply({
					content: `[ERROR]: ${error}`,
					ephemeral: true,
				});
			}
		} else if (interaction.isButton()) {
			const { buttons } = client;
			const { customId } = interaction;
			const button = buttons.get(customId);
			if (!button) return new Error("[ERROR]: No codes for this button");

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(`[ERROR]: ${error}`);
			}
		}
	},
};
