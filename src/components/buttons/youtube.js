const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: { name: "youtube" },
	async execute(interaction, client) {
		await interaction.editReply({
			content: `https://www.youtube.com/@DreamyMythic`,
			ephemeral: true,
		});
	},
};
