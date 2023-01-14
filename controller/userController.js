const AppError = require("../config/AppError");
const User = require("../model/User");
const setCookie = require("../utils/cookiesHandler");
const createToken = require("../utils/createToken");
const filterObject = require("../utils/filterObject");
const factory = require("./handlerFactory");

const getUserById = factory.getOne(User);
// const getUserById = async (req, res) => {
// 	try {
// 		const { id } = req.params;

// 		const user = await User.findById(id);

// 		user.toObject();

// 		// await user.d

// 		res.json(user);
// 	} catch (err) {
// 		console.log(err);
// 		res.json(err);
// 	}
// };

const getAllUsers = factory.getAll(User);
// const getAllUsers = async (req, res) => {
// 	const usersList = await User.find({}).byActiveUser();

// 	if (!usersList) {
// 		throw new AppError("Something went wrong!", 500);
// 	}
// 	res.send(usersList);
// };

const updatePassword = async (req, res) => {
	const { passwordCurrent, password, passwordConfirm } = req.body;

	if (!passwordCurrent || !password || !passwordConfirm) {
		throw new AppError("All fields are required!", 400);
	}

	const foundUser = await User.findById(req.user._id);
	if (!foundUser) {
		throw new AppError("Enter valid data!", 401);
	}

	const isPasswordMatched = await foundUser.isPasswordMatched(
		passwordCurrent
	);
	if (!isPasswordMatched) {
		throw new AppError("Unauthorized!", 401);
	}

	foundUser.password = password;
	foundUser.passwordConfirm = passwordConfirm;
	await foundUser.save();

	const token = await createToken(res, foundUser._id);

	// set cookie
	setCookie(res, token);

	res.json({
		status: "success",
		token,
		user: foundUser,
	});
};

const updateUser = async (req, res) => {
	const filteredBody = filterObject(req.body, "name", "email");

	// *use "$set" operator to enable update validator
	const updatedUser = await User.findByIdAndUpdate(
		req.user._id,
		{ $set: filteredBody },
		{ new: true, runValidators: true }
	);

	res.json({ status: "success", user: updatedUser });
};

const deleteUser = async (req, res) => {
	await User.findByIdAndUpdate(req.user._id, { active: false }).exec();

	res.status(201).json({ status: "success", data: null });
};

const updateUserByAdmin = factory.updateOne(User);
const deleteUserPermanent = factory.deleteOne(User);

// for testing the HTTP Parameter Pollution
const paginateUser = async (req, res) => {
	console.log(req.query);
	const sorts = req.query?.sort?.split?.(",");
	console.log(req.query, sorts);

	res.json({ msg: "hehehe" });
};

module.exports = {
	getUserById,
	getAllUsers,
	updateUser,
	updatePassword,
	deleteUser,
	updateUserByAdmin,
	deleteUserPermanent,
	paginateUser,
};
