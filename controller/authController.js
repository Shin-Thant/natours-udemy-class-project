const User = require("../model/User");
const AppError = require("../config/AppError");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const createToken = require("../utils/createToken");
const setCookie = require("../utils/cookiesHandler");

const register = async (req, res) => {
	const {
		name,
		email,
		photo,
		role,
		password,
		passwordConfirm,
		passwordChangedAt,
	} = req.body;

	if (!name || !email || !password || !passwordConfirm) {
		throw new AppError("All fields are required!", 400);
	}

	const newUser = await User.create({
		name,
		email,
		photo,
		role,
		password,
		passwordConfirm,
		passwordChangedAt,
	});

	if (!newUser) {
		throw new AppError("Enter valid data!", 400);
	}

	const token = await createToken(res, newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if ((!email, !password)) {
		throw new AppError("All fields are required!", 400);
	}

	const foundUser = await User.findOne({ email });

	if (!foundUser) {
		throw new AppError("Enter valid data!", 400);
	}

	// check password
	const passwordMatched = await foundUser.isPasswordMatched(password);
	if (!passwordMatched) {
		throw new AppError("Incorrect email or password!", 400);
	}

	const token = await createToken(res, foundUser._id);

	// set cookie
	setCookie(res, token);

	res.json({
		status: "success",
		token,
		data: {
			user: foundUser,
		},
	});
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		throw new AppError("User's email is required!", 400);
	}

	const foundUser = await User.findOne({ email }).exec();
	if (!foundUser) {
		throw new AppError("No user found with this email!", 404);
	}

	// generate random reset token
	const resetToken = foundUser.createPasswordResetToken();

	// !just temporary
	foundUser.passwordConfirm = foundUser.password;
	await foundUser.save();

	// send reset token through user's email
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/auth/resetPassword/${resetToken}`;

	const message = `Forgot your password? Submit a PATCH request with with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't request this, just ignore this email!`;

	try {
		await sendEmail({
			email: foundUser.email,
			subject: "Your password reset token (valid for 10 mins)",
			message,
		});

		res.json({ status: "success", message: "Token sent to your email!" });
	} catch (err) {
		// console.log({ errMsg: err.message });

		foundUser.passwordResetToken = undefined;
		foundUser.passwordResetExpires = undefined;

		await foundUser.save({ validateBeforeSave: false });

		res.status(500).json({
			status: "fail",
			message: "Something went wrong!, Try again later.",
		});
	}
};

const resetPassword = async (req, res) => {
	const { password, passwordConfirm } = req.body;

	if (!password || !passwordConfirm || !req.params.token) {
		throw new AppError("All fields are required!", 400);
	}

	// get user based on the reset token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	console.log({ hashedToken }, req.params.token);

	const foundUser = await User.findOne({
		passwordResetToken: hashedToken,
	}).exec();

	if (!foundUser) {
		throw new AppError("Unauthorized!", 401);
	}

	// if the token is not expired, and there is an user, change the password
	if (Date.now() > foundUser.passwordResetExpires.getTime()) {
		throw new AppError("Token expires! Try again.", 400);
	}

	foundUser.password = password;
	foundUser.passwordConfirm = passwordConfirm;
	foundUser.passwordResetToken = undefined;
	foundUser.passwordResetExpires = undefined;

	await foundUser.save();

	// update changedPasswordAt from user document

	// login the user and resend jwt
	const newToken = await createToken(res, foundUser._id);

	res.json({ status: "success", token: newToken });
};

const logout = async (req, res) => {
	if (!req.cookies) {
		console.log("no cookies!");
		return res.status(201).json({ status: "success" });
	}

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.status(201).json({ status: "success" });
};

module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword,
	logout,
};
