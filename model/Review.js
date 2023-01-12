const mongoose = require("mongoose");
const Tour = require("./Tour");

const reviewSchema = new mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, "Review is required!"],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			requried: true,
		},
		tour: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tour",
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
// index
// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
	// this.populate("user", "name photo").populate({
	// 	path: "tour",
	// 	select: "name",
	// });

	this.populate("user", "name photo");

	next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: {
				tour: tourId,
			},
		},
		{
			$group: {
				_id: "$tour",
				nRatings: {
					$sum: 1,
				},
				avgRatings: { $avg: "$rating" },
			},
		},
	]);

	console.log({ stats });

	await Tour.findByIdAndUpdate(tourId, {
		ratingsAverage: stats[0]?.nRatings || 0,
		ratingsQuantity: stats[0]?.avgRatings || 0,
	});
};

reviewSchema.post("save", function () {
	// this = current document
	// this.constructor = model
	console.log("create review mid running!!!");
	this.constructor.calcAverageRatings(this.tour);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
// 	this.reviewDoc = await this.findOne();

// 	next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
// 	console.log("post running");
// 	await this.reviewDoc.constructor.calcAverageRatings(this.reviewDoc.tour);
// });

module.exports = mongoose.model("Review", reviewSchema);
