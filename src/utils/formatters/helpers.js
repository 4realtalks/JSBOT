// helpers.js

function formatDuration(duration) {
	const seconds = Math.floor(duration % 60);
	const minutes = Math.floor((duration / 60) % 60);
	const hours = Math.floor((duration / (60 * 60)) % 24);
	const days = Math.floor((duration / (60 * 60 * 24)) % 7);
	const weeks = Math.floor(duration / (60 * 60 * 24 * 7));

	const parts = [];

	if (weeks > 0) {
		parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
	}
	if (days > 0) {
		parts.push(`${days} day${days > 1 ? "s" : ""}`);
	}
	if (hours > 0) {
		parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
	}
	if (minutes > 0) {
		parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
	}
	if (seconds > 0) {
		parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
	}

	return parts.join(" / ");
}

module.exports = {
	formatDuration: formatDuration,
};
