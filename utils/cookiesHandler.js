const setCookie = (res, token) => {
	const cookieOptions = {
		httpOnly: true,
		sameSite: "None",
		maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 1000,
		secure: true,
		// expires: new Date(
		// 	Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		// ),
	};

	if (process.env.NODE_ENV === "production") {
		cookieOptions.secure = true;
	}

	res.cookie("jwt", token, cookieOptions);
};

module.exports = setCookie;
