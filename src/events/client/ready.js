module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		console.log(`[INFO]: Logged in as ${client.user.username}`);
	},
};
