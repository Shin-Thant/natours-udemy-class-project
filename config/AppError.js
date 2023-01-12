function AppError(message, statusCode = 500) {
	const err = new Error(message);

	err.statusCode = statusCode;
	err.status = ("" + statusCode).startsWith("4") ? "failed" : "error";
	err.isOperational = true;

	return err;
}

module.exports = AppError;
