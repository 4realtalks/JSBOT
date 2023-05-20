require("dotenv").config();
const JSON_PATH = require("../config.json");
const { DISCORD_BOT_TOKEN } = JSON_PATH;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.Guilds,
	],
});
client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);

for (const folder of functionFolders) {
	const functionFiles = fs
		.readdirSync(`./src/functions/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of functionFiles) {
		require(`./functions/${folder}/${file}`)(client);
	}
}

client.handleEvents();
client.handleComponents();
client.login(DISCORD_BOT_TOKEN);
