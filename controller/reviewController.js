const AppError = require("../config/AppError");
const Review = require("../model/Review");
const factory = require("./handlerFactory");

// const getAllReviews = async (req, res) => {
// 	const queryFilter = {};

// 	if (req.params.tourId) queryFilter["tour"] = req.params.tourId;

// 	const reviews = await Review.find(queryFilter).lean().exec();

// 	if (!reviews) {
// 		throw AppError("Something went wrong!", 500);
// 	}

// 	res.json({ status: "success", data: reviews });
// };

const setTourUserId = (req, res, next) => {
	if (!req.body.tour) {
		req.body.tour = req.params.tourId;
	}
	if (!req.body.user) {
		req.body.user = req.user._id;
	}

	next();
};

const createReview = async (req, res) => {
	const { review, tour, user, rating } = req.body;

	if (!review || !user || !tour) {
		throw AppError("All fields are required!", 400);
	}

	// duplicate review
	const duplicateReview = await Review.findOne({ user, tour }).exec();
	if (duplicateReview) {
		throw AppError("Duplicate review", 400);
	}

	const newReview = await Review.create({ review, tour, user, rating });

	if (!newReview) {
		throw AppError("Something went wrong!", 500);
	}

	res.json({ status: "success", data: newReview });
};

const updateReview = async (req, res) => {
	const updatedReview = await Review.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true, runValidators: true }
	);

	// update tour rating
	await Review.calcAverageRatings(updatedReview.tour);

	res.json({ status: "success", data: updatedReview });
};

const deleteReview = async (req, res) => {
	const review = await Review.findByIdAndDelete({
		_id: req.params.id,
	}).exec();

	// console.log(review);

	if (!review) {
		throw AppError("No document found with that ID", 404);
	}

	await Review.calcAverageRatings(review.tour);

	res.status(204).json({
		status: "success",
		data: null,
	});
};

const getAllReviews = factory.getAll(Review);

// const createReview = factory.createOne(Review);

const getReviewById = factory.getOne(Review);

// const updateReview = factory.updateOne(Review);

// const deleteReview = factory.deleteOne(Review);

module.exports = {
	getAllReviews,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
	setTourUserId,
};
