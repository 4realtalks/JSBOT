const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getstatus")
    .setDescription("Get status")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("User's status")
        .addUserOption((option) =>
          option.setName("user").setDescription("Who?")
        )
    ),
  async execute(interaction, client, options) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const targetUser = options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setAuthor({ name: targetUser.username, iconURL: targetUser.avatarURL() })
      .setTitle(`${targetUser.username}'s Status`)
      .setColor(Colors.Green)
      .setDescription(
        `${targetUser.username}'s status is ${targetUser.presence?.status}`
      )
      .setTimestamp()
      .setFields(
        { name: "API Latency", value: `${client.ws.ping}ms` },
        {
          name: "Client Ping",
          value: `${interaction.createdTimestamp - message.createdTimestamp}ms`,
        }
      )
      .setFooter({
        text: `${client.user.username}`,
        iconURL: client.user.avatarURL(),
      });

    try {
      await interaction.editReply({ content: "", embeds: [embed] });
    } catch (error) {
      console.log(`[ERROR]: ${error}`);
      interaction.editReply({ content: `[ERROR]: ${error}`, ephemeral: true });
    }
  },
};
