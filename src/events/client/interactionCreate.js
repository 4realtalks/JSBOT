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
    }
  },
};
