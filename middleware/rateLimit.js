const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 20,
	message: "Too many request! Please try again in an hour!",
});
