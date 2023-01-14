const AppError = require("../config/AppError");

function sendError(err, res) {
	if (process.env.NODE_ENV === "development") {
		return res.status(err.statusCode).json({
			status: "fail",
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	if (!res.isOperational) {
		return res
			.status(500)
			.json({ status: "error", message: "Something went wrong!" });
	}

	return res.status(err.statusCode).json({
		status: "fail",
		message: err.message,
	});
}

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
	// *Mongoose Schema Error
	if (err.name === "CastError") {
		return sendError(AppError("Invalid Id!", 400), res);
	}

	// *Duplicate Field Error
	if (err.code === 11000) {
		const REGEX = /(["'])(\\?.)*?\1/;
		const duplicateValue = err.message.match(REGEX)[0];
		const errMessage = `Duplicate value: ${duplicateValue.slice(
			1,
			-1
		)}. Please use another one!`;

		return sendError(AppError(errMessage, 400), res);
	}

	// *handle mongoose validation error
	if (err.name === "ValidationError") {
		const errMessageArray = Object.values(err.errors).map(
			(err) => err.message
		);

		return sendError(
			AppError(`Invalid input data! ${errMessageArray.join(" ")}`, 400),
			res
		);
	}

	// *handle jwt errors
	if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
		// * instructor use '401'
		return sendError(AppError("Invalid token!", 403), res);
	}

	// *render error page
	if (!req.originalUrl.startsWith("/api")) {
		if (!err.isOperational) {
			return res.status(500).render("error", {
				title: "Something went wrong!",
				msg: "Please try again later!",
			});
		}

		return res.status(err.statusCode).render("error", {
			title: "Something went wrong!",
			msg: err.message,
		});
	}

	// !change this in production mode
	const statusCode = err.statusCode || 500;
	sendError(AppError(err.message, statusCode), res);
};
