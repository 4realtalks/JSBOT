const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const { formatDuration } = require("../../utils/formatters/helpers");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeouts a member")
    .addUserOption((option) =>
      option.setName("user").setDescription("Who?").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the timeout")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in seconds")
        .setRequired(false)
    ),
  async execute(interaction, client, options) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const target = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";
    const duration = interaction.options.getNumber("duration") || 3600;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setColor(Colors.Red)
      .setDescription(`Timeout ${target.user.tag}`)
      .setFields(
        { name: "User", value: `${target.user.tag}` },
        { name: "Reason", value: reason },
        {
          name: "Timeout Duration",
          value: formatDuration(duration),
        },
        {
          name: "API Latency",
          value: `${message.createdTimestamp - interaction.createdTimestamp}ms`,
        },
        { name: "Client Ping", value: `${client.ws.ping}ms` }
      )
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.avatarURL(),
      });

    try {
      if (target !== client.user) {
        await target.timeout(duration * 1000, reason);
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
