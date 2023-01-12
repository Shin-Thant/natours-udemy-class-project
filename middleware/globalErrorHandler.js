// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;

	// *invalid ObjectId Error
	if (err.name === "CastError") {
		return res.status(400).json({
			status: "fail",
			error: err,
			message: "Invalid Id!",
			stack: err.stack,
		});
	}

	// *handle mongoose validation error
	if (err.name === "ValidationError") {
		const errors = Object.values(err.errors).map((err) => err.message);

		return res.status(400).json({
			status: "fail",
			error: err,
			message: `Invalid input data! ${errors.join(" ")}`,
		});
	}

	// *handle jwt errors
	if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
		// * instructor use '401'
		return res.status(403).json({ message: "Invalid token!" });
	}

	// !change this in production mode
	res.status(statusCode).json({
		status: err.status || "fail",
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
