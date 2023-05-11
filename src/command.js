const path = require("path");
const fs = require("fs");

async function InitializeCommands() {
  const commandsDirectory = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(commandsDirectory).filter(file => file.endsWith(".js"));
  return commandFiles.map(file => path.join(commandsDirectory, file));
}

module.exports = {
  InitializeCommands: InitializeCommands
};
