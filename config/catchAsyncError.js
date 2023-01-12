// *Description - wrap request-response handler function to catch error

const catchAsyncError = (cb) => {
	return (req, res, next) => {
		cb(req, res).catch((err) => {
			err.status = err.status || 500;
			console.log("catch async");

			return next(err);
		});
	};
};

module.exports = catchAsyncError;
