const Tour = require("../model/Tour");
const AppError = require("../config/AppError");
const User = require("../model/User");

const getOverviewPage = async (req, res) => {
	// get tour data
	const tours = await Tour.find().exec();

	res.render("overview", { title: "All Tours", tours });
};

const getTourPage = async (req, res) => {
	const { slug } = req.params;

	// get tour details
	const tour = await Tour.findOne({ slug }).populate("reviews").exec();

	if (!tour) {
		throw AppError("Page Not Found!", 404);
	}

	res.render("tour", { title: `${tour.name} Tour`, tour });
};

const getLoginPage = (req, res) => {
	res.render("login", { title: "login your account" });
};

const getAccount = (req, res) => {
	res.render("account", { title: "Account" });
};

const updateUserData = async (req, res) => {
	const { name, email } = req.body;

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{ name, email },
		{ new: true, runValidators: true }
	).exec();

	res.status(201).render("account", { title: "Account", user: updatedUser });
};

module.exports = {
	getOverviewPage,
	getTourPage,
	getLoginPage,
	getAccount,
	updateUserData,
};
