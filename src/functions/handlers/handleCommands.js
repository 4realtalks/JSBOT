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

			const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

			const data = await rest.put(
				Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
				{
					body: client.commandArray,
				}
			);

			console.log(
				`[INFO]: Successfully refreshed application (/) command(s)! (${data.length} command(s) available.)`
			);
		} catch (error) {
			console.error(`[ERROR]: ${error}`);
		}
	};
};
