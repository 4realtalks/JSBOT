const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`[INFO]: Logged in as ${client.user.username}`);

    client.user.setPresence({
      activities: [{ name: "/help", type: ActivityType.Playing }],
    });

    try {
      client.handleCommands();
    } catch (error) {
      console.error(`[ERROR]: ${error}`);
    }
  },
};
