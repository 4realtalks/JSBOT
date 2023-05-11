const { Client, IntentsBitField } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { InitializeCommands } = require("./command");

const client = new Client({ intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMembers] });

require("dotenv/config");

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

const commandsList = [];

InitializeCommands().then(commandFiles => {
  commandFiles.forEach(commandFile => {
    try {
      const command = require(commandFile);
      commandsList.push(command);
    } catch (error) {
      console.error(error);
    }
  });

  (async () => {
    try {
      console.log("Refreshing Commands...");

      console.log(commandsList.map(command => command.data));

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commandsList.map(command => command.data) }
      );

      console.log("Refreshed Commands!");
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  const matchedCommand = commandsList.find(command => command.data.name === commandName);

  if (matchedCommand) {
    try {
      await matchedCommand.execute(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

try {
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.error(error);
}
