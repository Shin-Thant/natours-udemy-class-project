const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

module.exports = async (req, res, next) => {
	// *access 'bearer' token with `req.headers.`(object format) or `req.header('...')`(function format)

	const bearerTokenString =
		req.headers.authorization || req.headers.Authorization;

	let token;

	if (bearerTokenString && bearerTokenString.startsWith("Bearer ")) {
		token = bearerTokenString.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return res
			.status(401)
			.json({ status: "fail", message: "Unauthorized!" });
	}

	// *new use case✨
	// `promisify()` method accept function and return the same function whose return type is wrapped with `promise`
	const decodedPayload = await util.promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	const foundUser = await User.findById(decodedPayload.id);
	if (!foundUser) {
		return res.status(403).json({ message: "Something went wrong!" });
	}

	// check if the password is changed before the token is issued
	if (foundUser.isPasswordChanged(decodedPayload.iat)) {
		return res.status(401).json({ message: "Please login again!" });
	}

	req.user = foundUser;

	next();
};
