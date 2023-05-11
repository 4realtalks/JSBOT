const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  data: {
    name: "ping",
    description: "Check bot's latency"
  },
  async execute(interaction) {
    const startTime = Date.now();
    await interaction.reply("Checking latency...");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setDescription("Pong!")
      .setColor(Colors.Green)
      .addField({name: "Latency", value: `${Date.now() - startTime}ms`})
      .setFooter(Date.now().toString());

    await interaction.editReply({ embeds: [embed] });
  }
}