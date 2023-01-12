const AppError = require("../config/AppError");
const Tour = require("../model/Tour");
// const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");

const getAllTours = factory.getAll(Tour);
// const getAllTours = async (req, res) => {
// 	// execute query
// 	const features = new APIFeatures(Tour, req.query)
// 		.filter()
// 		.sort()
// 		.limit()
// 		.paginate();
// 	const allTours = await features.query.exec();
// 	// const allTours = await query.populate("reviews").exec();

// 	if (!allTours) {
// 		throw AppError("Something went wrong!", 500);
// 	}

// 	res.json({
// 		status: "succss",
// 		results: allTours.length,
// 		data: allTours,
// 	});
// };

// const getTourById = async (req, res) => {
// 	const tour = await Tour.findOne({ _id: req.params.id })
// 		.populate("reviews")
// 		.exec();

// 	if (!tour) {
// 		throw AppError("No tour found with that ID", 404);
// 	}

// 	res.status(200).json({
// 		status: "success",
// 		data: {
// 			tour,
// 		},
// 	});
// };

// const createTour = async (req, res) => {
// 	const newTour = await Tour.create(req.body);

// 	res.status(201).json({
// 		status: "success",
// 		data: {
// 			tour: newTour,
// 		},
// 	});
// };

// const updateTour = async (req, res) => {
// 	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 		runValidators: true,
// 	});

// 	if (!tour) {
// 		throw AppError("No tour found with that ID", 404);
// 	}

// 	res.status(200).json({
// 		status: "success",
// 		data: {
// 			tour,
// 		},
// 	});
// };

// const deleteTour = async (req, res) => {
// 	const tour = await Tour.findByIdAndDelete(req.params.id);

// 	if (!tour) {
// 		throw AppError("No tour found with that ID", 404);
// 	}

// 	res.status(204).json({
// 		status: "success",
// 		data: null,
// 	});
// };

// using handlerFactory
// const getAllTours = factory.getAll(Tour);
const getTourById = factory.getOne(Tour, "reviews");
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

// url - /tours-within/:distance/center/:latlng/unit/:unit
// url - /tours-within/320/center/34.030718, -118.304814/unit/km
const getToursWithin = async (req, res) => {
	const { distance, latlng, unit } = req.params;

	if (!distance || !latlng || !unit) {
		throw AppError("All fields are required!", 400);
	}

	const [lat, lng] = latlng.split(",");
	if (!lat || !lng) {
		throw AppError("Provide lagitude and longitude!", 400);
	}

	// radius must be in 'radiun' unit
	const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

	// longitude value must first than latitude
	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.json({ status: "success", result: tours.length, data: tours });
};

// other example operations
// {
// 	$nearSphere: {
// 		$geometry: {
// 			type: "Point",
// 			coordinates: [lng, lat],
// 		},
// 		// $minDistance: 20000,
// 		$maxDistance: 1000000,
// 	},
// },

const getDistance = async (req, res) => {
	const { latlng, unit } = req.params;

	if (!latlng || !unit) {
		throw AppError("All fields are required!", 400);
	}

	const [lat, lng] = latlng.split(",");
	if (!lat || !lng) {
		throw AppError("Provide lagitude and longitude!", 400);
	}

	const multiplier = unit === "mi" ? 0.00621371 : 0.001;

	// result is in `meter` unit
	const distance = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [parseInt(lng), parseInt(lat)],
				},
				distanceField: "distance",
				distanceMultiplier: multiplier, // multiply the result from `distanceField`
				// includeLocs: "distanceLocs",
			},
		},
		// {
		// 	$project: {
		// 		name: 1,
		// 		duration: 1,
		// 		maxGroupSize: 1,
		// 		distance: 1,
		// 	},
		// },
	]);

	res.json({ status: "success", data: distance });
};

module.exports = {
	getAllTours,
	getTourById,
	createTour,
	updateTour,
	deleteTour,
	getToursWithin,
	getDistance,
};
