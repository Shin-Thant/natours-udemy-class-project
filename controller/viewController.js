const Tour = require("../model/Tour");
const AppError = require("../config/AppError");

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
		throw AppError("No tour with this name!", 404);
	}

	res.render("tour", { title: `${tour.name} Tour`, tour });
};

const getLoginPage = (req, res) => {
	res.render("login", { title: "login your account" });
};

module.exports = { getOverviewPage, getTourPage, getLoginPage };
