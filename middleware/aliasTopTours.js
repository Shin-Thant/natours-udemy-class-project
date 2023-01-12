module.exports = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price,-ratingsAverage";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";

	next();
};
