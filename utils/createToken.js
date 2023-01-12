const jwt = require("jsonwebtoken");
const AppError = require("../config/AppError");

// create token
const createToken = async (res, id) => {
	try {
		const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		if (!token) {
			throw AppError("Something went wrong!", 500);
		}

		return token;
	} catch (err) {
		return res.status(500).json({ message: "Something went wrong!" });
	}
};

module.exports = createToken;
