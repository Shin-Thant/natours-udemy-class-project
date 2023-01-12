const AppError = require("../config/AppError");
const APIFeatures = require("../utils/apiFeatures");

const getAll = (Model) => async (req, res) => {
	// to allow nested routes for reviews
	const queryFilter = {};
	if (req.params.tourId) queryFilter["tour"] = req.params.tourId;

	const features = new APIFeatures(Model, req.query, queryFilter)
		.filter()
		.sort()
		.limit()
		.paginate();
	const allDoc = await features.query.exec();

	if (!allDoc) {
		throw AppError("Something went wrong!", 500);
	}

	res.json({
		status: "succss",
		results: allDoc.length,
		data: allDoc,
	});
};

const getOne = (Model, populateOptions) => async (req, res) => {
	const doc = await Model.findOne({ _id: req.params.id }).exec();

	// console.log({populateOptions});

	if (!doc) {
		throw AppError("No document found with that ID", 404);
	}

	if (populateOptions) {
		await doc.populate(populateOptions);
	}

	res.status(200).json({
		status: "success",
		data: doc,
	});
};

const createOne = (Model) => async (req, res) => {
	const newDoc = await Model.create(req.body);

	res.status(201).json({
		status: "success",
		data: newDoc,
	});
};

const updateOne = (Model) => async (req, res) => {
	const updatedDocument = await Model.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true, runValidators: true }
	);

	res.json({ status: "success", data: updatedDocument });
};

const deleteOne = (Model) => async (req, res) => {
	const document = await Model.findByIdAndDelete({
		_id: req.params.id,
	}).exec();

	if (!document) {
		throw AppError("No document found with that ID", 404);
	}

	res.status(204).json({
		status: "success",
		data: null,
	});
};

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
