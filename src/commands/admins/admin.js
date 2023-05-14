require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");
const axios = require("axios");
const JSON_PATH = require("../../../config.json")
const { OPENCLOUD_KEY, UNIVERSE_ID, ENTRY_KEY } = JSON_PATH;
const crypto = require("crypto");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("Admin?")
		.addSubcommandGroup((subcommandgroup) =>
			subcommandgroup
				.setName("data")
				.setDescription("Data?")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("register")
						.setDescription("Registers admin by username")
						.addStringOption((option) =>
							option
								.setName("user")
								.setDescription("Roblox username?")
								.setRequired(true)
						)
						.addBooleanOption((option) =>
							option
								.setName("active")
								.setDescription("Active?")
								.setRequired(false)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("modify")
						.setDescription("Modifies the admin data by username")
						.addStringOption((option) =>
							option
								.setName("user")
								.setDescription("Roblox username?")
								.setRequired(true)
						)
						.addBooleanOption((option) =>
							option
								.setName("active")
								.setDescription("Active?")
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("delete")
						.setDescription("Deletes the admin data from username")
						.addStringOption((option) =>
							option
								.setName("user")
								.setDescription("Roblox username?")
								.setRequired(true)
						)
				)
		),
	async execute(interaction, client, options) {
		if (interaction.user.id !== "967833698827386891") return;

		const subcommand = options.getSubcommand();

		const message = await interaction.deferReply({ fetchReply: true });

		if (!subcommand) return;

		if (subcommand === "register") {
			const robloxusername = options.getString("user");
			const active = options.getBoolean("active") || true;
			let userId = 0;
			let response = null;

			try {
				response = await axios.post(
					"https://users.roblox.com/v1/usernames/users",
					{
						usernames: [robloxusername],
						excludeBannedUsers: true,
					},
					{
						headers: {
							"contnet-type": "application/json",
						},
					}
				);

				if (response.data && response.data.data.length > 0) {
					userId = response.data.data[0].id;
					console.log("User ID:", userId);
				} else {
					console.log("User not found.");
				}
			} catch (error) {
				if (error.response && error.response.status === 404) {
					console.log("User not found.");
				} else {
					console.error("An error occurred:", error.message);
				}
			}

			if (!response.data || response.data.errors) {
				await interaction.editReply({
					content: "The provided username does not exist on Roblox.",
					ephemeral: true,
				});
				return;
			}

			try {
				let datastore = null;
				let postresponse = null;

				try {
					const response = await axios.get(
						`https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
						{
							params: {
								datastoreName: "AdministratorWhilelist",
								entryKey: ENTRY_KEY,
							},
							headers: {
								"x-api-key": OPENCLOUD_KEY,
								"Content-Type": "application/json",
							},
						}
					);

					datastore = response
				} catch (error) {
					console.error(`[ERROR]: ${error}`)
				}

				const list = datastore.data;

				console.log(list);

				const metadata = {
					Name: robloxusername,
					Active: active,
					UserId: userId.toString(),
					AdminId: `adminuser@${userId.toString()}`,
				};

				list[Object.keys(list).length + 1] = metadata;

				const jsonmeta = JSON.stringify(list);

				const content = await crypto
					.createHash("md5")
					.update(jsonmeta)
					.digest("base64");

				console.log(content);

				try {
					const response = await axios.post(
						`https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`,
						jsonmeta,
						{
							params: {
								datastoreName: "AdministratorWhilelist",
								entryKey: ENTRY_KEY,
							},
							headers: {
								"content-md5": content,
								"x-api-key": OPENCLOUD_KEY,
								"Content-Type": "application/json",
							},
						}
					);

					postresponse = response
				} catch (error) {
					console.error(`[ERROR]: ${error}`)
				}

				if (postresponse.data) {
					const embed = new EmbedBuilder()
						.setAuthor({
							name: client.user.username,
							iconURL: client.user.avatarURL(),
						})
						.setColor(Colors.Aqua)
						.setDescription("Registered admin user!")
						.setFields(
							{ name: "Name", value: metadata.Name },
							{ name: "AdminId", value: metadata.AdminId },
							{ name: "UserId", value: metadata.UserId },
							{ name: "Active", value: metadata.Active },
							{
								name: "API Latency",
								value: message.createdTimestamp - interaction.createdTimestamp,
							},
							{ name: "Client Ping", value: client.ws.ping }
						)
						.setFooter({
							text: client.user.username,
							iconURL: client.user.avatarURL(),
						})
						.setTimestamp()
						.setTitle("Succeed!");

					await interaction.editReply({
						content: "",
						embeds: [embed],
						ephemeral: true,
					});
				}
			} catch (error) {
				console.error(`[ERROR]: ${error}`);
				await interaction.editReply({
					content: `[ERROR]: ${error}`,
					ephemeral: true,
				});
			}
		}
	},
};
