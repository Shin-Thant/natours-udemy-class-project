const sharp = require("sharp");

const resizeProfileImage = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const IMAGE_QUALITY = 85;

	const fileName = `user-${req.user._id}-${Date.now()}.jpeg`;
	const filePath = `public/img/users/${fileName}`;

	req.file.filename = fileName;

	// resize image and save that file in disk
	await sharp(req.file.buffer)
		.resize(500, 500) // resize
		.toFormat("jpeg") // format file (output methods)
		.jpeg({ quality: IMAGE_QUALITY }) // image quality percent (output methods)
		.toFile(filePath); // save file (output methods)

	next();
};

module.exports = resizeProfileImage;
