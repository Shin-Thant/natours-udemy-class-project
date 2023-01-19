const sharp = require("sharp");
const IMAGE_QUALITY = 85;
const IMAGE_SIZE = { width: 2000, height: 1333 };

const resizeAndSaveCoverImage = async (req) => {
	const tourCoverImageName = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
	const tourCoverImagePath = `public/img/tours/${tourCoverImageName}`;

	req.body.imageCover = tourCoverImageName;

	await sharp(req.files.imageCover[0].buffer)
		.resize(IMAGE_SIZE.width, IMAGE_SIZE.height)
		.toFormat("jpeg")
		.jpeg({ quality: IMAGE_QUALITY })
		.toFile(tourCoverImagePath);
};

const resizeAndSaveSideImages = async (req) => {
	req.body.images = [];

	await Promise.all(
		req.files.images.map(async (img, index) => {
			const tourImageName = `tour-${req.params.id}-${Date.now()}-${
				index + 1
			}.jpeg`;
			const tourImagePath = `public/img/tours/${tourImageName}`;

			req.body.images.push(tourImageName);

			await sharp(img.buffer)
				.resize(IMAGE_SIZE.width, IMAGE_SIZE.height)
				.toFormat("jpeg")
				.jpeg({ quality: IMAGE_QUALITY })
				.toFile(tourImagePath);
		})
	);
};

const resizeTourImages = async (req, res, next) => {
	if (!req.files || !req.files.imageCover || !req.files.images) {
		return next();
	}

	// resize and save `imageCover`
	await resizeAndSaveCoverImage(req);

	// resize and save `images`
	await resizeAndSaveSideImages(req);

	next();
};

module.exports = resizeTourImages;
