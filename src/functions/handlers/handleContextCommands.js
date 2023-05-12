const fs = require("fs");
const path = require("path");

module.exports = (client) => {
	console.log("[INFO]: Registering command(s) to the context menu...");

	client.handleContextCommands = async () => {
		try {
			console.log("[INFO]: Registering context menu commands...");

			const commandFiles = fs.readdirSync(`./src/commands/utils`).filter((file) => file.endsWith(".js"));

			const commands = [];
			for (const file of commandFiles) {
				const command = require(`../../commands/utils/${file}`);
				commands.push(command.data.toJSON());
			}

			await client.application.commands.set(commands);

			console.log("[INFO]: Context menu commands registered successfully!");
		} catch (error) {
			console.error("[ERROR]: Failed to register context menu commands:", error);
		}
	};
};
