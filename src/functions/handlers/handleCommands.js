const { REST, Routes } = require("discord.js");
const fs = require("fs");
require("dotenv").config();
const { GUILD_ID, CLIENT_ID, DISCORD_BOT_TOKEN } = process.env;

module.exports = (client) => {
  console.log(`[INFO]: Registering command(s)...`);
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./src/commands`);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
      }
    }
    console.log(`[INFO]: Registered command(s)!`);
    try {
      console.log("[INFO]: Started refreshing application (/) command(s)...");

      const data = await client.application.commands.set(client.commandArray, GUILD_ID);

      console.log(
        `[INFO]: Successfully refreshed application (/) command(s)! (${data.size} command(s) available.)`
      );
    } catch (error) {
      console.error(`[ERROR]: ${error}`);
    }
  };
};
