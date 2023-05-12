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
    const channel = options.getChannel("channel") || interaction.channel;

    const message = await interaction.deferReply({
      fetchReply: true,
    });

    try {
      if (!channel) {
        throw new Error("Channel not found.");
      }

      const fetchedMessages = await channel.messages.fetch();

      fetchedMessages.forEach((message) => {
        message.delete();
      });

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
        .setFields(
          { name: "API Latency", value: `${client.ws.ping}ms` },
          {
            name: "Client Ping",
            value: `${
              interaction.createdTimestamp - message.createdTimestamp
            }ms`,
          }
        )
        .setFooter({
          text: client.user.username,
          iconURL: client.user.avatarURL(),
        });

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
