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
    if (!interaction.deferred) {
      await interaction.deferReply({ fetchReply: true });
    }

    const message = await interaction.fetchReply();

    const target = options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setAuthor({ name: target.username, iconURL: target.avatarURL() })
      .setTitle(`${target.username}'s Status`)
      .setColor(Colors.Green)
      .setDescription(
        `${target.username}'s status is ${target.presence?.status}`
      )
      .setTimestamp()
      .setFields(
        { name: "API Latency", value: `${message.createdTimestamp - interaction.createdTimestamp}ms` },
        {
          name: "Client Ping",
          value: `${client.ws.ping}ms`,
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
