const mongoose = require("mongoose");

module.exports = async () => {
	await mongoose.connect(process.env.LOCAL_DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};
