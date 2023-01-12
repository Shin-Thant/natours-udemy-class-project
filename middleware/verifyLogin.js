const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Check user is verified,
const verifyLogin = async (req, res, next) => {
	const cookies = req.cookies;

	if (!cookies.jwt) {
		return next();
	}

	const token = cookies.jwt;
	if (!token) {
		return next();
	}

	// verify token
	const decodedPayload = await util.promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET
	);

	// check user exists
	const foundUser = await User.findById(decodedPayload.id);
	if (!foundUser) {
		return next();
	}

	// check if the password is changed before the token is issued
	if (foundUser.isPasswordChanged(decodedPayload.iat)) {
		return next();
	}

	// user is logined
	res.locals.user = foundUser; // *pass user object to template thrugh the `res.locals`

	next();
};

module.exports = verifyLogin;
